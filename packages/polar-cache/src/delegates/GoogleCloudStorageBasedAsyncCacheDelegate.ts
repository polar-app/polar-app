import {IDStr} from "polar-shared/src/util/Strings";
import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Lazy} from "polar-shared/src/util/Lazy";
import {Datastores} from "polar-hooks-functions/impl/datastore/Datastores";
import {File} from '@google-cloud/storage';
import { Streams } from "polar-shared/src/util/Streams";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);

export namespace GoogleCloudStorageBasedAsyncCacheDelegate {

    export function create<K, V>(nspace: IDStr): AsyncCacheDelegate<K, V> {

        interface ICacheEntry {
            readonly id: IDStr;
            readonly written: ISODateTimeString;
            readonly value: V;
            readonly nspace: IDStr;
        }

        function createFile(key: K) {

            const id = computeID(key);
            const storagePath = `polar-cache/${nspace}/${id}.json`;
            const project = storageConfig().config.project;
            const bucketName = `gs://${project}.appspot.com`;
            const bucket = storage().bucket(bucketName);
            return new File(bucket, storagePath);

        }

        function computeID(key: K): IDStr {
            return Hashcodes.create({nspace, key});
        }

        async function containsKey(key: K): Promise<boolean> {
            const file = createFile(key);
            return (await file.exists())[0];
        }

        async function get(key: K): Promise<V | undefined> {

            if (await containsKey(key)) {

                console.log("GoogleCloudStorageBasedAsyncCacheDelegate: HIT");

                const file = createFile(key);
                const buff = await Streams.toBuffer(file.createReadStream());
                const data = buff.toString('utf-8');
                const entry: ICacheEntry = JSON.parse(data);
                return entry.value;
            }

            console.log("GoogleCloudStorageBasedAsyncCacheDelegate: MISS");

            return undefined;

        }

        async function put(key: K, value: V) {

            console.log("GoogleCloudStorageBasedAsyncCacheDelegate: PUT");

            const entry: ICacheEntry = {
                id: computeID(key),
                written: ISODateTimeStrings.create(),
                value,
                nspace
            }

            const file = createFile(key);
            await file.save(JSON.stringify(entry));

        }

        return {containsKey, get, put};

    }
}
