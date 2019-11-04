import * as firebase from './lib/firebase';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {Firebase} from './Firebase';

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

            const result = firebase.firestore();

            const settings = {
                // timestampsInSnapshots: true
            };

            result.settings(settings);

            if (opts.enablePersistence) {

                // TODO: this seems super slow and not sure why.  The tab sync
                // seems to not impact performance at all.
                await tracer.traceAsync('enablePersistence', async () => {
                    try {
                        await result.enablePersistence({synchronizeTabs: true});
                    } catch(e) {
                        // we've probably exceeded the local quota so we can't run with caching for now.
                        console.warn("Unable to use persistence. Data will not be cached locally: ", e);
                    }
                });
            }

            return result;

        });

    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}

