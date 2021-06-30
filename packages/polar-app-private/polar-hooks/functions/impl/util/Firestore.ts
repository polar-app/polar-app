import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {IFirestoreAdmin} from "polar-firestore-like/src/IFirestore";

export namespace Firestore {

    export function getInstance(): IFirestoreAdmin {
        const app = FirebaseAdmin.app();
        return app.firestore();
    }

}
