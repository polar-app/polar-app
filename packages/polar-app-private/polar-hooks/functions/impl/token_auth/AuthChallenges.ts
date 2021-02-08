import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

interface IAuthChallenge {
    readonly id: string;
    readonly email: string;
    readonly challenge: string;
}

export namespace AuthChallenges {

    const COLLECTION_NAME = 'auth_challenge';

    export async function write(email: string, challenge: string) {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const id = Hashcodes.createID(email);

        const collection = await firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const value: IAuthChallenge = {
            id, email, challenge
        }

        ref.set(value);

    }

    export async function get(email: string): Promise<IAuthChallenge | undefined> {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const hashcode = Hashcodes.createID(email);

        const collection = await firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(hashcode);

        const snapshot = await ref.get();

        if (snapshot.exists) {
            return snapshot.data() as IAuthChallenge;
        } else {
            return undefined;
        }

    }

}