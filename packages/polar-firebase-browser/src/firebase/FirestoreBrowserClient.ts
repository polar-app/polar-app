import firebase from 'firebase/app'
import 'firebase/firestore';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {FirebaseBrowser} from './FirebaseBrowser';
import {Logger} from "polar-shared/src/logger/Logger";
import {Tracer} from 'polar-shared/src/util/Tracer';
import {StoreCaches} from "polar-snapshot-cache/src/StoreCaches";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {URLStr} from "polar-shared/src/util/Strings";

const log = Logger.create();

const IS_NODE = typeof window === 'undefined';

// **** BEGIN iOS IndexDB lock workaround
//
// This has to be called during the import EARLY so that this fixes any Safari
// bugs documented here:
//
// https://github.com/firebase/firebase-js-sdk/issues/4076
// https://bugs.webkit.org/show_bug.cgi?id=226547

function execIndexedDBWorkaround() {

    if (! IS_NODE) {

        const idb = globalThis.indexedDB || window.indexedDB;

        if (idb) {

            console.log("Running IndexedDB workaround... ");

            const dummyDbName = 'safariIdbFix';
            indexedDB.open(dummyDbName);
            indexedDB.deleteDatabase(dummyDbName);

            console.log("Running IndexedDB workaround... done");

        } else {
            console.warn("IndexedDB workaround not run: no IDB");
        }

    } else {
        console.warn("IndexedDB workaround not run: node");
    }

}

execIndexedDBWorkaround();

// **** BEGIN iOS IndexDB lock workaround

const ENABLE_PERSISTENCE = StoreCaches.config.backing === 'none';

// const ENABLE_PERSISTENCE = false;

export namespace FirestoreBrowserClient {

    let instance: firebase.firestore.Firestore | undefined;

    async function initDelegate(opts: FirestoreOptions) {
        console.log("Initializing firestore with: ", opts);
        FirebaseBrowser.init();
        return await createInstance(opts)
    }

    // TODO: since this is created on init, the stack for when it's eventually
    // called is a bit weird.  We might want to make this into a function
    // which is init'd when it's actually used to preserve the stack.
    const firestoreProvider = AsyncProviders.memoize1<FirestoreOptions, firebase.firestore.Firestore>(initDelegate);

    /**
     * Allows us to init with custom options.
     */
    export async function init(opts: FirestoreOptions = {enablePersistence: ENABLE_PERSISTENCE}) {

        if (instance) {
            return;
        }

        instance = await firestoreProvider(opts);
        return instance;

    }

    export async function getInstance(): Promise<IFirestoreClient> {
        await init();

        // return instance!;
        return await StoreCaches.create().build(instance! as any)

    }

    async function createInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        const doExecAsync = async (): Promise<firebase.firestore.Firestore> => {

            try {

                log.notice("Initializing firestore...");

                const firestore = firebase.firestore();

                const settings = {
                    // timestampsInSnapshots: true
                    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
                };

                firestore.settings(settings);

                if (opts.enablePersistence) {
                    await enablePersistence(firestore);
                }

                return firestore;

            } finally {
                log.notice("Initializing firestore...done");
            }

        }

        return await Tracer.async(doExecAsync, 'Firestore.createInstance');

    }

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

                // Without synchronizeTabs=true the main document repository works
                // but the viewer windows complain that they do not have access to
                // work with the disk persistence.

                if (! IS_NODE) {

                    await withinAnimationFrameAsync(async () => {

                        console.log("Enabling firestore persistence (within animation frame)....");
                        await firestore.enablePersistence({synchronizeTabs: true});
                        console.log("Enabling firestore persistence (within animation frame)....done");

                    })

                }


            } catch (e) {
                // we've probably exceeded the local quota so we can't run with caching for now.
                console.warn("Unable to use persistence. Data will not be cached locally: ", e);
            }

        }
        // TODO: this seems super slow and not sure why.  The tab sync
        // seems to not impact performance at all.
        await Tracer.async(doExecAsync, 'Firestore.enablePersistence');

    }

    export async function terminate() {
        console.log("Terminating Firestore...")
        await instance?.terminate();
        console.log("terminating firestore...done")
    }

    /**
     * Used when we have to redirect to a new URL because Firestore has to be
     * terminated or it won't work with Safari and will lock up the browser.
     */
    export async function terminateAndRedirect(url: URLStr) {
        await terminate();
        window.location.href = url;
    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}






