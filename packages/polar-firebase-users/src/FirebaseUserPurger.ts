import {UIDStr} from "polar-shared/src/util/Strings";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";


/**
 * Purge a user and all their data for testing and removal from the service.
 */
export namespace FirebaseUserPurger {

    export async function doPurge(uid: UIDStr) {

        const firebase = FirebaseAdmin.app();
        const auth = firebase.auth();
        const firestore = FirestoreAdmin.getInstance();

        async function verifyUserExists() {
            await auth.getUser(uid);
        }

        type CollectionNames = string[];
        interface ISchema {
            readonly [schema: string]: CollectionNames
        }

        async function doPurgeCollections() {

            const uidSchemas: ISchema = {
                'uid': [
                    'doc_meta',
                    'doc_meta2',
                    'doc_info',
                    'block',
                    'heartbeat',
                    'account',
                    'block_expand',
                    'block_permission_user',
                    'cloud_storage_tombstone',
                    'contact',
                    'doc_file_meta',
                    'doc_permission',
                    'spaced_rep',
                    'spaced_rep_stat',
                    'user_pref',
                    'user_trait',
                ],
                'referrer_uid': [
                    'user_referral'
                ]
            }

            interface IRecord {
                readonly id: string;
                readonly uid: string;
            }

            async function doPurgeCollection(collectionName: string, uidField: string) {

                console.log("Purging collection: " + collectionName);
                
                const records = await Collections.list<IRecord>(firestore, collectionName, [[uidField, '==', uid]]);
                
                // TODO: would be faster to do this via matches.
                for(const record of records) {
                    await Collections.doDelete(firestore, collectionName, record.id);
                }

            }

            for (const schema in uidSchemas) {
                for (const collectionName of uidSchemas[schema]) {
                    await doPurgeCollection(collectionName, schema);
                }
            }

        }

        async function doDeleteUser() {
            await auth.deleteUser(uid);
        }

        await verifyUserExists();
        await doPurgeCollections();

        await doDeleteUser();

    }

}
