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

    type SnapshotTimer = () => void;
    type LatchAndSnapshotTimer = readonly [Latch<boolean>, SnapshotTimer];

    function createSnapshotTimer(collectionName: string): LatchAndSnapshotTimer {

        const before = Date.now();
        const latch = new Latch<boolean>();

        const snapshotTimer = () => {
            const after = Date.now();
            const duration = Math.abs(after - before);
            console.log(`Snapshot duration for ${collectionName}: ${duration}ms`);
            latch.resolve(true);
        }

        return [latch, snapshotTimer];

    }

    function createSnapshotForCollection(collectionName: string): Promise<boolean> {
        const collection = firestore.collection(collectionName);
        const [latch, onNext] = createSnapshotTimer(collectionName);
        collection.where('uid', '==', user.uid).onSnapshot(onNext);
        return latch.get();
    }

    function createSnapshotForBlockCollection(): Promise<boolean> {
        const collection = firestore.collection('block');
        const [latch, onNext] = createSnapshotTimer('block');
        collection.where('nspace', '==', user.uid).onSnapshot(onNext);
        return latch.get();
    }


    // FIXME: compute the total duration for all the snapshots via some sort of
    // countdown latch... but I think it's going to be about 2.5s.

    // FIXME: measure each one of these individually

    // FIXME: we're actually running out of memory accessing this much data!
    // That's sort of the main problem now.

    await Tracer.async(async () => {

        await createSnapshotForBlockCollection();
        await createSnapshotForCollection('doc_meta');
        await createSnapshotForCollection('doc_info');
        await createSnapshotForCollection('spaced_rep');
        await createSnapshotForCollection('spaced_rep_stat');

    }, 'all snapshots');


}


doTestFirestore().catch(err => console.error(err));

// doTestIndexedDB().catch(err => console.error(err));
