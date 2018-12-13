import * as firebase from './lib/firebase';

export class Firestore {

    private static firestore?: firebase.firestore.Firestore;

    public static async getInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        if (this.firestore) {
            return this.firestore;
        }

        return this.firestore = await this.createInstance(opts);

    }

    public static async createInstance(opts: FirestoreOptions = {}): Promise<firebase.firestore.Firestore> {

        const result = firebase.firestore();

        const settings = {timestampsInSnapshots: true};
        result.settings(settings);

        if (opts.enablePersistence) {
            await result.enablePersistence({experimentalTabSynchronization: true});
        }

        return result;

    }

}

export interface FirestoreOptions {
    readonly enablePersistence?: boolean;
}

