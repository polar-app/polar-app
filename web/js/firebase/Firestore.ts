import * as firebase from './lib/firebase';
import {RendererAnalytics} from '../ga/RendererAnalytics';

const tracer = RendererAnalytics.createTracer('firestore');

export class Firestore {

    private static firestore?: firebase.firestore.Firestore;

    public static async getInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        if (this.firestore) {
            return this.firestore;
        }

        return this.firestore = await this.createInstance(opts);

    }

    public static async createInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

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
                    await result.enablePersistence({ experimentalTabSynchronization: true });
                });
            }

            return result;

        });

    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}

