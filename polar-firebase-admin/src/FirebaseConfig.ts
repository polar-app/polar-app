import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {AppOptions} from 'firebase-admin';

export namespace FirebaseConfig {

    export function create(): FirebaseConfig | undefined {

        const config = functions.config();

        const serviceAccount = JSON.parse(config.polar.firebase.service_account);

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

