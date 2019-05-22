import * as firebase from './lib/firebase';

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
            // timestampsInSnapshots: true
        };

        return this.app = firebase.initializeApp(config);

    }

    public static async currentUser(): Promise<firebase.User | null> {

        Firebase.init();

        return new Promise<firebase.User | null>((resolve, reject) => {

            const unsubscribe = firebase.auth()
                .onAuthStateChanged((user) => {
                                        unsubscribe();
                                        resolve(user);
                                    },
                                    (err) => {
                                        unsubscribe();
                                        reject(err);
                                    });

        });

    }


}

export type UserID = string;
