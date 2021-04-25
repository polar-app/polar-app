import {DocumentReference, WriteBatch} from "@google-cloud/firestore";
import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {GroupIDStr} from './Groups';
import {IDUser} from '../../util/IDUsers';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {FirestoreTypedArray} from "polar-firebase/src/firebase/Collections";

export class DocPermissions {

    public static readonly COLLECTION = 'doc_permission';

    public static doc(docID: FirebaseDocMetaID): DocumentReference {

        const app = FirebaseAdmin.app();
        const firestore = app.firestore();

        return firestore.collection('doc_permission').doc(docID);

    }

    public static async get(docID: FirebaseDocMetaID): Promise<DocPermission | undefined> {
        const snapshot = await this.doc(docID).get();
        return <DocPermission> snapshot.data();
    }

    public static async create(idUser: IDUser, doc: DocRef) {

        // TODO: shouldn't this be within a batch?

        const  {docID} = doc;

        const ref = this.doc(docID);

        // TODO: I need a way to set the permission BACK to private when and
        // remove it from all groups...  Right now we do not have an API for
        // this.  This isn't a blocker though.

        const docPermission: DocPermission = {
            id: docID,
            uid: idUser.uid,
            fingerprint: doc.fingerprint,
            visibility: 'private',
        };

        await ref.create(docPermission);

    }

    public static async exists(docID: FirebaseDocMetaID): Promise<boolean> {
        const snapshot = await this.doc(docID).get();
        return snapshot.exists;
    }

}

/**
 * We only need the backend and the name of the file to be able to compute the
 * internal URL.
 */
export interface DocPermission {

    /**
     * The ID record for this doc.
     */
    readonly id: FirebaseDocMetaID;

    /**
     * The uid of the user sharing this doc file.
     */
    readonly uid: string;

    /**
     * The fingerprint for this document
     */
    readonly fingerprint: string;

    readonly visibility: DocVisibility;

    readonly groups?: FirestoreTypedArray<GroupIDStr>;

}

export type DocVisibility = 'private' | 'protected' | 'public';

export type FirebaseDocMetaID = string;
