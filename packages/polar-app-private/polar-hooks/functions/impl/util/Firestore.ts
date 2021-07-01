import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {IFirestoreAdmin} from "polar-firestore-like/src/IFirestore";

export namespace Firestore {

    export function getInstance(): IFirestoreAdmin {
        const app = FirebaseAdmin.app();
        // TODO: do not cast it as any - the 'metadata' property is missing but
        // we're just going to use unknown for now.  It's a bit of a hack
        // though.
        return app.firestore() as any;
    }

}
