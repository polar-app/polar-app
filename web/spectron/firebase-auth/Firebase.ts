// import * as firebase from 'firebase';

declare var firebase: any;

export class Firebase {

    /**
     * Perform init of Firebase with our auth credentials.
     */
    public static init() {

        const config = {
            apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
            authDomain: "polar-32b0f.firebaseapp.com",
            databaseURL: "https://polar-32b0f.firebaseio.com",
            projectId: "polar-32b0f",
            storageBucket: "polar-32b0f.appspot.com",
            messagingSenderId: "919499255851"
        };

        firebase.initializeApp(config);
    }

}
