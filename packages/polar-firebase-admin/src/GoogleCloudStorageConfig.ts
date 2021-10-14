import {FirebaseConfig} from "./FirebaseConfig";
import {ServiceAccounts} from "./FirebaseAdmin";
import {Storage} from '@google-cloud/storage';

export namespace GoogleCloudStorageConfig {

    import IFirebaseConfig = FirebaseConfig.IFirebaseConfig;

    export interface IStorageConfig {
        readonly config: IFirebaseConfig;
        readonly storage: Storage;
    }

    export function create(): IStorageConfig {

        const config = FirebaseConfig.create();

        if (! config) {
            throw new Error("No config");
        }

        console.log("Creating storage config for project: " + config.project);

        const storage = new Storage(ServiceAccounts.toStorageOptions(config.serviceAccount));

        return {config, storage};

    }
}
