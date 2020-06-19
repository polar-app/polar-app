import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {Firebase} from './Firebase';
import {Logger} from "polar-shared/src/logger/Logger";
import {Tracer} from 'polar-shared/src/util/Tracer';

const log = Logger.create();

export namespace Firestore {

    let instance: firebase.firestore.Firestore | undefined;

    async function initDelegate(opts: FirestoreOptions) {
        Firebase.init();
        return await createInstance(opts)
    }

    const firestoreProvider = AsyncProviders.memoize1<FirestoreOptions, firebase.firestore.Firestore>(initDelegate);

    /**
     * Allows us to init with custom options.
     */
    export async function init(opts: FirestoreOptions = {enablePersistence: true}) {

        if (instance) {
            return;
        }

        instance = await firestoreProvider(opts);
        return instance;
    }

    export async function getInstance(): Promise<firebase.firestore.Firestore> {
        await init();
        return instance!;
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

        return await Tracer.async(doExecAsync, 'createInstance');

    }

    async function enablePersistence(firestore: firebase.firestore.Firestore) {

        const doExecAsync = async () => {

            try {

                // Without synchronizeTabs=true the main document repository works
                // but the viewer windows complain that they do not have access to
                // work with the disk persistence.


                console.time('enable-firestore-persistence');
                await firestore.enablePersistence({synchronizeTabs: true});
                console.timeEnd('enable-firestore-persistence');

            } catch (e) {
                // we've probably exceeded the local quota so we can't run with caching for now.
                console.warn("Unable to use persistence. Data will not be cached locally: ", e);
            }

        }
            // TODO: this seems super slow and not sure why.  The tab sync
        // seems to not impact performance at all.
        await Tracer.async(doExecAsync, 'enablePersistence');

    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}






