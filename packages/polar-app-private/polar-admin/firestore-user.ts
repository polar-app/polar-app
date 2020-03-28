// benchmark firebase datastore access...
import * as firebase from 'firebase';

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

const config = {
    apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
    authDomain: "polar-32b0f.firebaseapp.com",
    databaseURL: "https://polar-32b0f.firebaseio.com",
    projectId: "polar-32b0f",
    storageBucket: "polar-32b0f.appspot.com",
    messagingSenderId: "919499255851",
    // timestampsInSnapshots: true
};

export class Firebase {

    public static async getFirestore() {

        firebase.initializeApp(config);

        const app = firebase.app();

        if (! app) {
            throw new Error("No app");
        }

        const auth = firebase.auth;
        console.log("auth: ", auth);

        console.log("app: ", app);
        console.log("app keys: ", Object.keys(app));

        // await auth.signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
        return app.firestore();

    }

}

