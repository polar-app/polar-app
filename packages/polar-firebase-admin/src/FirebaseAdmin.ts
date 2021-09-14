import * as admin from 'firebase-admin';
import {StorageOptions} from '@google-cloud/storage';
import {FirebaseConfig} from './FirebaseConfig';
import {FirebaseAdminSecrets} from "./FirebaseAdminSecrets";

let app: admin.app.App;

FirebaseAdminSecrets.init();

export class FirebaseAdmin {

    public static app() {

        if (app) {
            return app;
        }

        app = this.createApp();
        return app;

    }

    public static createApp() {

        const firebaseConfig = FirebaseConfig.create();

        const initializeApp = () => {

            if (firebaseConfig) {
                console.log("Creating app for project: " + firebaseConfig.project);
                return admin.initializeApp(firebaseConfig.appOptions);

            } else {
                return admin.initializeApp();
            }

        };

        const app = initializeApp();

        return app;

    }

}

export class ServiceAccounts {

    public static toStorageOptions(serviceAccount: admin.ServiceAccount): StorageOptions {

        return {
            projectId: serviceAccount.projectId,
            credentials: {
                private_key: serviceAccount.privateKey,
                client_email: serviceAccount.clientEmail
            }
        };

    }

}
