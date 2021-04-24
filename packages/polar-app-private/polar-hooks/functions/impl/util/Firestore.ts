import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';

export class Firestore {

    public static getInstance() {
        const app = FirebaseAdmin.app();
        return app.firestore();
    }

}
