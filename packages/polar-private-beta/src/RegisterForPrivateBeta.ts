import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Challenges} from "polar-shared/src/util/Challenges";
import {IRegisterForPrivateBetaRequest} from "polar-private-beta-api/src/IRegisterForPrivateBetaRequest";
import {
    IRegisterForPrivateBetaError,
    IRegisterForPrivateBetaResponse
} from "polar-private-beta-api/src/IRegisterForPrivateBetaResponse";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

/**
 * Main function for adding users to our private beta.  Takes a user and a tag
 * as part of the request and updates the collection
 */
export namespace RegisterForPrivateBeta {

    const userExists = async (email: string) => {
        const auth = FirebaseAdmin.app().auth();
        try {
            await auth.getUserByEmail(email);
            return true;
        } catch (e) {
            return false;
        }
    }

    export async function exec(request: IRegisterForPrivateBetaRequest): Promise<IRegisterForPrivateBetaResponse | IRegisterForPrivateBetaError> {
        const exists = await userExists(request.email);

        if (exists) {
            return {message: "This email is already registered. Try logging in instead."};
        }

        const firestore = FirestoreAdmin.getInstance();
        const {challenge} = Challenges.create();

        const id = PrivateBetaReqCollection.createID(request.email);

        const record = await PrivateBetaReqCollection.get(firestore, id);

        const tags = [...(record?.tags || []), request.tag];

        await PrivateBetaReqCollection.set(firestore, {
            tags,
            email: request.email,
            challenge
        })

        // TODO: send them an email thanking them...

        return {};

    }


}
