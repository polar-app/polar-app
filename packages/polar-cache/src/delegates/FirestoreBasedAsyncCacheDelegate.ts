import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {IDStr, JSONStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace FirestoreBasedAsyncCacheDelegate {

    const COLLECTION_NAME = 'cache';

    export function create<K, V>(): AsyncCacheDelegate<K, V> {

        interface ICacheEntry {
            readonly id: IDStr;
            readonly written: ISODateTimeString;
            readonly value: JSONStr;
        }

        function computeID(key: K): IDStr {
            return Hashcodes.create(key);
        }

        function getDocumentReference(key: K) {

            const firestore = FirestoreAdmin.getInstance();

            const id = computeID(key);

            const collection = firestore.collection(COLLECTION_NAME);
            return collection.doc(id);

        }

        async function getSnapshot(key: K) {
            const doc = getDocumentReference(key);
            return await doc.get();
        }

        async function containsKey(key: K): Promise<boolean> {

            const snapshot = await getSnapshot(key);

            return snapshot.exists;

        }

        async function get(key: K): Promise<V | undefined> {

            const snapshot = await getSnapshot(key);

            if (snapshot.exists) {
                console.log("FirestoreBasedAsyncCacheDelegate: HIT");
                const entry = snapshot.data() as ICacheEntry;
                return JSON.parse(entry.value);
            }

            console.log("FirestoreBasedAsyncCacheDelegate: MISS");

            return undefined;

        }

        async function put(key: K, value: V) {

            console.log("FirestoreBasedAsyncCacheDelegate: PUT");

            const entry: ICacheEntry = {
                id: computeID(key),
                written: ISODateTimeStrings.create(),
                value: JSON.stringify(value)
            }

            const doc = getDocumentReference(key);
            await doc.set(entry);
        }

        return {containsKey, get, put};

    }

}
