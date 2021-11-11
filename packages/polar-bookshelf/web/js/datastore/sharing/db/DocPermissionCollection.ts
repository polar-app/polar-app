import {GroupIDStr} from "../../Datastore";
import {DatastoreCollection} from "../../FirebaseDatastore";
import firebase from 'firebase/app'
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import GetOptions = firebase.firestore.GetOptions;

export namespace DocPermissionCollection {

    export async function get(id: DocPermissionIDStr, options?: GetOptions): Promise<DocPermission | undefined> {

        const firestore = await FirestoreBrowserClient.getInstance();

        const ref = firestore
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        const doc = await ref.get(options);

        if (doc.exists) {
            return <DocPermission> doc.data();
        }

        return undefined;

    }

}

export interface DocPermission {

    // the visibility of this record.
    readonly visibility: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr>;

}

export type DocPermissionIDStr = string;

