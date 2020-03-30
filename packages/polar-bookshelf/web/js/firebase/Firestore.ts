import * as firebase from './lib/firebase';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {Firebase} from './Firebase';
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

const tracer = RendererAnalytics.createTracer('firestore');

const opts: FirestoreOptions = {enablePersistence: true};

export class Firestore {

    private static firestoreProvider = AsyncProviders.memoize(async () => await Firestore.createInstance(opts));

    public static async getInstance(): Promise<firebase.firestore.Firestore> {
        Firebase.init();

        return await this.firestoreProvider();
    }

    private static async createInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        return await tracer.traceAsync('createInstance', async () => {

            try {

                log.notice("Initializing firestore...");

                const firestore = firebase.firestore();

                const settings = {
                    // timestampsInSnapshots: true
                };

                firestore.settings(settings);

                if (opts.enablePersistence) {
                    this.enablePersistence(firestore);
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
        await tracer.traceAsync('enablePersistence', async () => {

            try {

                // Without synchronizeTabs=true the main document repository works
                // but the viewer windows complain that they do not have access to
                // work with the disk persistence.

                await firestore.enablePersistence({synchronizeTabs: true});

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

