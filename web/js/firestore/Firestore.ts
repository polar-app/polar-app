import * as firebase from './lib/firebase';

export class Firestore {

    private static firestore?: firebase.firestore.Firestore;

    public static async getInstance(): Promise<firebase.firestore.Firestore> {

        if(this.firestore) {
            return this.firestore;
        }

        this.firestore = firebase.firestore();

        const settings = {timestampsInSnapshots: true};
        this.firestore.settings(settings);

        await this.firestore.enablePersistence({experimentalTabSynchronization: true});

        return this.firestore;

    }

}

