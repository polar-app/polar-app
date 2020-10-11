import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {AppOptions} from 'firebase-admin';
import {isPresent} from "polar-shared/src/Preconditions";

export namespace FirebaseConfig {

    export function create(): FirebaseConfig | undefined {


        function computeServiceAccount() {

            function computeFirebaseConfigFromEnvironment(): any {

                if (process.env.FIREBASE_CONFIG !== undefined) {

                    const result = JSON.parse(process.env.FIREBASE_CONFIG);

                    if (result.private_key) {
                        return result;
                    } else {
                        return undefined;
                    }

                }

            }

            function computeFirebaseConfigFromConfig() {
                const config = functions.config();
                return config.polar.firebase.service_account;
            }

            const fromEnvironment = computeFirebaseConfigFromEnvironment();

            if (fromEnvironment) {
                return fromEnvironment;
            } else {
                return computeFirebaseConfigFromConfig();
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

