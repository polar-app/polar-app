import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {UserInterview} from "./UserInterview";
import {EmailStr} from "polar-shared/src/util/Strings";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

/**
 * Work with user interviews directly.
 */
export class UserInterviews {

    public static readonly COLLECTION = 'user_interview';

    public static async get(email: EmailStr): Promise<UserInterview | undefined> {
        const firestore = FirestoreAdmin.getInstance();
        return await Collections.getByID(firestore, this.COLLECTION, email);
    }

    public static doc(email: EmailStr) {
        const app = FirebaseAdmin.app();
        const firestore = app.firestore();
        return firestore.collection(this.COLLECTION).doc(email);
    }

    public static async write(email: EmailStr, userInterview: UserInterview) {
        const ref = this.doc(email);
        await ref.set(userInterview);
    }

}
