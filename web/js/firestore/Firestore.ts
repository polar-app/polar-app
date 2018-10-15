import * as firebase from './lib/firebase';

export class Firestore {

    public static getInstance(): firebase.firestore.Firestore {

        const firestore = firebase.firestore();

        const settings = {timestampsInSnapshots: true};
        firestore.settings(settings);

        return firestore;

    }

}
