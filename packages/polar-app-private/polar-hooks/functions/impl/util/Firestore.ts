import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {IFirestore} from "packages/polar-app-public/polar-firestore-like/src/IFirestore";

export namespace Firestore {

    export function getInstance(): IFirestore {
        const app = FirebaseAdmin.app();
        return app.firestore();
    }

}
