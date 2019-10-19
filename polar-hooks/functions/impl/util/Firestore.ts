import {FirebaseAdmin} from './FirebaseAdmin';

export class Firestore {

    public static getInstance() {
        const app = FirebaseAdmin.app();
        return app.firestore();
    }

}
