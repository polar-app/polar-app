import * as firebase from './lib/firebase';
// import fb = firebase;

export class Firebase {

    private static app?: firebase.app.App;

    /**
     * Perform init of Firebase with our auth credentials.
     */
    public static init(): firebase.app.App {


        if (this.app) {
            return this.app;
        }

        const config = {
            apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
            authDomain: "polar-32b0f.firebaseapp.com",
            databaseURL: "https://polar-32b0f.firebaseio.com",
            projectId: "polar-32b0f",
            storageBucket: "polar-32b0f.appspot.com",
            messagingSenderId: "919499255851",
            timestampsInSnapshots: true
        };

        return this.app = firebase.initializeApp(config);

    }

}
