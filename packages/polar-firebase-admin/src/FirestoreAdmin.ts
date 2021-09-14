import * as _firestore from '@google-cloud/firestore';
import {FirebaseAdmin} from './FirebaseAdmin';
import {IFieldValueFactory, IFirestoreAdmin, IFirestoreLib} from "polar-firestore-like/src/IFirestore";

export namespace FirestoreAdmin {

    export function getInstance(): IFirestoreAdmin & IFirestoreLib {

        const app = FirebaseAdmin.app();

        const client = app.firestore();

        const FieldValue: IFieldValueFactory = {
            arrayUnion: (...elements: any[]) => _firestore.FieldValue.arrayUnion(...elements),
            arrayRemove: (...elements: any[]) => _firestore.FieldValue.arrayRemove(...elements),
            delete: () => _firestore.FieldValue.delete(),
        }

        return {
            collection: (collectionName: string) => client.collection(collectionName) as any,
            batch: () => client.batch() as any,
            terminate: () => client.terminate(),

            FieldPath: (...fields: string[]) => new _firestore.FieldPath(...fields),
            FieldValue
        }

    }

}
