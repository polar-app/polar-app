import firebase from 'firebase/app'
import 'firebase/firestore';
import {Latch} from "polar-shared/src/util/Latch";
import {Tracer} from "polar-shared/src/util/Tracer";

require('firebase/auth');

async function doTestIndexedDB() {

    console.log("Debugging IndexDB performance");

    const dbName = 'firestore/[DEFAULT]/polar-32b0f/main'

    const req = indexedDB.open(dbName);

    req.onerror = event => {
        console.error("Could not open IndexDB", event);
    }

    req.onsuccess = event => {
        console.log("Open of IndexDB worked", event);
        const db = req.result;

        const transaction = db.transaction('remoteDocuments');

        // the main store is remoteDocuments... but it doesn't have an index so I'm confused here...

        const objectStore = transaction.objectStore('remoteDocuments');

        let nrKeys = 0;
        const before = Date.now();

        objectStore.openCursor().onsuccess = (event => {

            // TS types are wrong here...
            const cursor: IDBCursor = (event.target as any).result;

            if(cursor) {
                cursor.continue();

                const value = (cursor as any).value;
                const document = value.document;

                if (document) {
                    nrKeys += Object.keys(document).length;
                }

            } else {
                const after = Date.now();
                const duration = after - before;
                console.log(`Entries all displayed: nrKeys: ${nrKeys}, duration: ${duration}`);
            }

        });

    }

}

async function doTestFirestore() {

    const key = {
        apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
        authDomain: "polar-32b0f.firebaseapp.com",
        databaseURL: "https://polar-32b0f.firebaseio.com",
        projectId: "polar-32b0f",
        storageBucket: "polar-32b0f.appspot.com",
        messagingSenderId: "919499255851",
        // timestampsInSnapshots: true
    }

    async function initFirebase() {

        const userLatch = new Latch<firebase.User>();

        function describeUser(user: firebase.User | null): any {

            if (user) {
                return {
                    uid: user.uid,
                    email: user.email
                };
            }

            return undefined;

        }

        function startListeningForUser(app: firebase.app.App) {

            if (! app) {
                throw new Error("No app defined");
            }

            if (typeof app.auth !== 'function') {
                const msg = "app.auth is not a function.";
                console.warn(msg, app);
                throw new Error(msg);
            }

            const auth = app.auth();

            const onNext = (user: firebase.User | null) => {
                console.log("firebase: auth state next: ", describeUser(user));
                userLatch.resolve(user!);
                return user;

            }

            const onError = (err: firebase.auth.Error) => {
                console.error("firebase: auth state error", err);
            }

            auth.onAuthStateChanged(onNext, onError);

        }

        const app = firebase.initializeApp(key);
        startListeningForUser(app);
        return await userLatch.get();

    }

    async function initFirestore() {

        async function withinAnimationFrameAsync<T>(callback: () => Promise<T>) {

            return new Promise<T>((resolve, reject) => {

                requestAnimationFrame(() => {
                    callback()
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                });

            })

        }

        async function enablePersistence(firestore: firebase.firestore.Firestore) {

            const doExecAsync = async () => {

                try {

                    await withinAnimationFrameAsync(async () => {

                        console.log("Enabling firestore persistence (within animation frame)....");
                        await firestore.enablePersistence({synchronizeTabs: true});
                        console.log("Enabling firestore persistence (within animation frame)....done");

                    })


                } catch (e) {
                    // we've probably exceeded the local quota so we can't run with caching for now.
                    console.warn("Unable to use persistence. Data will not be cached locally: ", e);
                }

            }
            // TODO: this seems super slow and not sure why.  The tab sync
            // seems to not impact performance at all.
            await Tracer.async(doExecAsync, 'Firestore.enablePersistence');

        }

        try {

            console.log("Initializing firestore...");

            const firestore = firebase.firestore();

            const settings = {
                // timestampsInSnapshots: true
                cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
            };

            firestore.settings(settings);

            await enablePersistence(firestore);

            return firestore;

        } finally {
            console.log("Initializing firestore...done");
        }

    }

    const user = await initFirebase();
    const firestore = await initFirestore();

    type SnapshotTimer = (snapshot: firebase.firestore.QuerySnapshot) => void;
    type LatchAndSnapshotTimer = readonly [Latch<boolean>, SnapshotTimer];

    function createSnapshotTimer(collectionName: string): LatchAndSnapshotTimer {

        const before = Date.now();
        const latch = new Latch<boolean>();

        const timerKey = 'snapshot:' + collectionName;

        console.time(timerKey);

        const snapshotTimer = (snapshot: firebase.firestore.QuerySnapshot) => {
            const after = Date.now();
            const duration = Math.abs(after - before);

            console.log(`Snapshot duration for ${collectionName} with ${snapshot.size} docs: ${duration}ms`);
            latch.resolve(true);
            console.timeEnd(timerKey);

        }

        return [latch, snapshotTimer];

    }

    type Unsubscriber = () => void;
    type FirstSnapshotPromise = Promise<boolean>;
    type UnsubscriberAndFirstSnapshotPromise = readonly [Unsubscriber, FirstSnapshotPromise];

    function createSnapshotForCollection(collectionName: string): UnsubscriberAndFirstSnapshotPromise {
        const collection = firestore.collection(collectionName);
        const [latch, onNext] = createSnapshotTimer(collectionName);
        const unsubscriber = collection.where('uid', '==', user.uid).onSnapshot(onNext);
        return [unsubscriber, latch.get()];
    }

    function createSnapshotForBlockCollection(): UnsubscriberAndFirstSnapshotPromise {
        const collection = firestore.collection('block');
        const [latch, onNext] = createSnapshotTimer('block');
        const unsubscriber = collection.where('nspace', '==', user.uid).onSnapshot(onNext);
        return [unsubscriber, latch.get()];
    }

    // FIXME: compute the total duration for all the snapshots via some sort of
    // countdown latch... but I think it's going to be about 2.5s.

    // FIXME: measure each one of these individually

    // FIXME: we're actually running out of memory accessing this much data!
    // That's sort of the main problem now.

    const unsubscribers = await traceAsync('promise snapshots', async () => {

        const snapshots = [
            createSnapshotForBlockCollection(),
            createSnapshotForCollection('doc_meta'),
            createSnapshotForCollection('doc_info'),
            createSnapshotForCollection('spaced_rep'),
            createSnapshotForCollection('spaced_rep_stat'),
        ]

        const promises = snapshots.map(current => current[1]);

        await Promise.all(promises);

        return snapshots.map(current => current[0]);

    });

    await traceAsync('unsubscribing promises', async () => {
        unsubscribers.forEach(unsubscriber => unsubscriber());
    });

    await traceAsync('terminate firestore', async () => {
        console.log("Terminating firestore...")
        await firestore.terminate();
        console.log("Terminating firestore...done")
    })

}

function doDebug() {

    async function doAsync() {
        markStarting();
        await doTestFirestore();
        markCompleted();
    }

    doAsync().catch(err => console.error(err));
    //
    // // doTestIndexedDB().catch(err => console.error(err));

}

function resetBody() {
    document.body.innerText = '';
}

function createButton() {

    const button = document.createElement('button');
    button.onclick = () => doDebug();
    button.appendChild(document.createTextNode('Click to Debug'));
    button.setAttribute('style', 'font-size: 18px; margin: 10px;')

    document.body.appendChild(button);

}

function markStarting() {

    const div = document.createElement('div');
    div.setAttribute('style', 'font-size: 18px; color: white; margin: 10px;')
    div.appendChild(document.createTextNode('Benchmark starting...'))

    document.body.appendChild(div);

}

function markCompleted() {

    const div = document.createElement('div');
    div.setAttribute('style', 'font-size: 18px; color: green; margin: 10px;')
    div.appendChild(document.createTextNode('Benchmark Complete!'))

    document.body.appendChild(div);

}

function setupPageForDebug() {

    resetBody();
    createButton();

}

setupPageForDebug();

async function traceAsync<T>(timeKey: string, closure: () => Promise<T>) {
    console.time(timeKey);
    const result = await closure();
    console.timeEnd(timeKey);
    return result;
}
