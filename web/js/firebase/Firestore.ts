import * as firebase from './lib/firebase';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {Firebase} from './Firebase';
import {Logger} from "polar-shared/src/logger/Logger";
import {Tracer} from 'polar-shared/src/util/Tracer';

const log = Logger.create();

const opts: FirestoreOptions = {enablePersistence: true};

export class Firestore {

    private static firestoreProvider = AsyncProviders.memoize(async () => await Firestore.createInstance(opts));

    public static async getInstance(): Promise<firebase.firestore.Firestore> {
        Firebase.init();

        return await this.firestoreProvider();
    }

    private static async createInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        return await Tracer.execAsync('createInstance', async () => {

            try {

                log.notice("Initializing firestore...");

                const firestore = firebase.firestore();

                const settings = {
                    // timestampsInSnapshots: true
                    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
                };

                firestore.settings(settings);

                if (opts.enablePersistence) {
                    await this.enablePersistence(firestore);
                }

                return firestore;

            } finally {
                log.notice("Initializing firestore...done");
            }

        });

    }

    private static async enablePersistence(firestore: firebase.firestore.Firestore) {

        // TODO: this seems super slow and not sure why.  The tab sync
        // seems to not impact performance at all.
        await Tracer.execAsync('enablePersistence', async () => {

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

        });

    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}

