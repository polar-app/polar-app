import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {AppOptions} from 'firebase-admin';

export namespace FirebaseConfig {

    export function create(): FirebaseConfig | undefined {


        function computeServiceAccount() {

            if (process.env.FIREBASE_CONFIG) {
                return JSON.parse(process.env.FIREBASE_CONFIG);
            } else {
                const config = functions.config();
                return config.polar.firebase.service_account;
            }
        }

        const serviceAccount = computeServiceAccount();

        return {
            project: serviceAccount.projectId!,
            serviceAccount,
            appOptions: {
                credential: admin.credential.cert(serviceAccount),
                databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
            }
        };

    }

}

export interface FirebaseConfig {
    readonly project: string;
    readonly serviceAccount: admin.ServiceAccount;
    readonly appOptions: AppOptions;
}

