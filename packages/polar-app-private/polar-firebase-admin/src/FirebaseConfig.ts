import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {AppOptions} from 'firebase-admin';

export namespace FirebaseConfig {

    export interface IServiceAccount {
        readonly projectId: string;
        readonly clientEmail: string;
        readonly privateKey: string;
    }

    export interface IFirebaseConfig {
        readonly project: string;
        readonly serviceAccount: admin.ServiceAccount;
        readonly appOptions: AppOptions;
    }

    export function create(): IFirebaseConfig | undefined {

        function computeServiceAccount() {

            function computeFirebaseConfigFromEnvironment(): IServiceAccount | undefined {

                if (process.env.FIREBASE_CONFIG !== undefined) {

                    const result = JSON.parse(process.env.FIREBASE_CONFIG);

                    if (result.privateKey) {
                        return result;
                    }

                }

                return undefined;

            }

            function computeFirebaseConfigFromConfig() {
                const config = functions.config();
                return config?.polar?.firebase?.service_account;
            }

            const fromEnvironment = computeFirebaseConfigFromEnvironment();

            if (fromEnvironment) {
                return fromEnvironment;
            } else {
                return computeFirebaseConfigFromConfig();
            }

        }

        const serviceAccount = computeServiceAccount();

        if (! serviceAccount) {
            throw new Error("No service account found . Set firebase.config or FIREBASE_CONFIG");
        }

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

