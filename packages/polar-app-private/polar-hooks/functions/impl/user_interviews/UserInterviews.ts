import {Collections} from "../groups/db/Collections";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {UserInterview} from "./UserInterview";
import {EmailStr} from "polar-shared/src/util/Strings";

/**
 * Work with user interviews directly.
 */
export class UserInterviews {

    public static readonly COLLECTION = 'user_interview';

    public static async get(email: EmailStr): Promise<UserInterview | undefined> {
        return await Collections.getByID(this.COLLECTION, email);
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
