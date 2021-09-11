import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace UserInterviews {

    const COLLECTION = 'user_interview2'

    interface IUserInterview {
        readonly id: string;
        readonly employee: string;
        readonly customer: string;
        readonly created: ISODateTimeString;
    }

    export async function get(id: string): Promise<IUserInterview | undefined> {

        const firestore = FirestoreAdmin.getInstance();
        const ref = firestore.collection(COLLECTION).doc(id);
        const doc = await ref.get();

        if (doc.exists) {
            return doc.data() as IUserInterview;
        }

        return undefined;

    }

    export async function set(id: string, employee: string, customer: string) {

        const firestore = FirestoreAdmin.getInstance();

        const record: IUserInterview = {
            id,
            employee,
            customer,
            created: ISODateTimeStrings.create()
        }

        const ref = firestore.collection(COLLECTION).doc(id);
        await ref.set(record)

    }

}
