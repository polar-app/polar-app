import * as firebase from './lib/firebase';

const CONFIG_PRODUCTION = {
    apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
    authDomain: "polar-32b0f.firebaseapp.com",
    databaseURL: "https://polar-32b0f.firebaseio.com",
    projectId: "polar-32b0f",
    storageBucket: "polar-32b0f.appspot.com",
    messagingSenderId: "919499255851",
    // timestampsInSnapshots: true
};

const CONFIG_STAGING = {
    apiKey: "AIzaSyB-MXbMazU0ag4g126NGXi0h6lUxk76XBc",
    authDomain: "polar-cors.firebaseapp.com",
    databaseURL: "https://polar-cors.firebaseio.com",
    projectId: "polar-cors",
    storageBucket: "polar-cors.appspot.com",
    messagingSenderId: "706724471731",
    appId: "1:706724471731:web:f4fe9fac758b2914"
};

const CONFIG_TEST = {
    apiKey: "AIzaSyByrYfWcYQAFaBRroM-M96lWCyX0cp3SKg",
    authDomain: "polar-test2.firebaseapp.com",
    databaseURL: "https://polar-test2.firebaseio.com",
    projectId: "polar-test2",
    storageBucket: "polar-test2.appspot.com",
    messagingSenderId: "1051837764975",
    appId: "1:1051837764975:web:8f9f8fd4a3a9b76b"
};

export class Firebase {

    private static app?: firebase.app.App;

    /**
     * Perform init of Firebase with our auth credentials.
     */
    public static init(): firebase.app.App {

        if (this.app) {
            return this.app;
        }

        const config = CONFIG_TEST;

        console.log("FIXME: using config: ", CONFIG_TEST);

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
