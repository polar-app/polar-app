import * as firebase from 'firebase/app';
import 'firebase/auth';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

const PROJECTS: {[project: string]: any} = {

    "polar-test2": {
        apiKey: "AIzaSyByrYfWcYQAFaBRroM-M96lWCyX0cp3SKg",
        authDomain: "polar-test2.firebaseapp.com",
        databaseURL: "https://polar-test2.firebaseio.com",
        projectId: "polar-test2",
        storageBucket: "polar-test2.appspot.com",
        messagingSenderId: "1051837764975",
        appId: "1:1051837764975:web:8f9f8fd4a3a9b76b"
    },
    "prod": {
        apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
        authDomain: "polar-32b0f.firebaseapp.com",
        databaseURL: "https://polar-32b0f.firebaseio.com",
        projectId: "polar-32b0f",
        storageBucket: "polar-32b0f.appspot.com",
        messagingSenderId: "919499255851",
        // timestampsInSnapshots: true
    }

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

        try {

            log.notice("Initializing firebase...");

            this.app = this.doInit();

            return this.app;

        } finally {
            log.notice("Initializing firebase...done");
        }

    }

    private static doInit() {

        const project = process.env.POLAR_TEST_PROJECT || 'prod';

        log.info("Connecting to firebase with project: " + project);

        Preconditions.assertPresent(project, "project");

        const config = PROJECTS[project];

        Preconditions.assertPresent(config, "config");

        return firebase.initializeApp(config);

    }

    public static currentUser(): firebase.User | null {
        Firebase.init();
        return firebase.auth().currentUser;
    }

    public static async currentUserAsync(): Promise<firebase.User | null> {

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

    public static async currentUserID(): Promise<UserIDStr | undefined> {

        const user = await this.currentUserAsync();

        if  (user) {
            return user.uid;
        }

        return undefined;
    }

}

export type UserIDStr = string;

export type UserID = UserIDStr;


