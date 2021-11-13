import {GroupIDStr} from "../../Datastore";
import firebase from 'firebase/app'
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {FirebaseDatastoresShared} from "polar-shared-datastore/src/FirebaseDatastoresShared";
import GetOptions = firebase.firestore.GetOptions;

export namespace DocPermissionCollection {

    import DatastoreCollection = FirebaseDatastoresShared.DatastoreCollection;

    export async function get(firestore: IFirestore<unknown>,
                              id: DocPermissionIDStr,
                              options?: GetOptions): Promise<DocPermission | undefined> {

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

