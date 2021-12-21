import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Challenges} from "polar-shared/src/util/Challenges";
import {IRegisterForPrivateBetaRequest} from "polar-private-beta-api/src/IRegisterForPrivateBetaRequest";
import {
    IRegisterForPrivateBetaError,
    IRegisterForPrivateBetaResponse
} from "polar-private-beta-api/src/IRegisterForPrivateBetaResponse";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";

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
        });

        const message = {
            to: request.email,
            from: 'founders@getpolarized.io',
            subject: `Polar | Early access list`,
            html: `<p>Hi!</p>
                   <p>Thanks for signing up for early access to Polar. We’re consistently letting in new users and your turn is coming up soon!</p>
                   <p>Cheers</p>
                   <p>The Polar team</p>
                   <p style="font-size: smaller; color: #c6c6c6;">Polar - Read. Learn. Never Forget.</p>`
        };
        await Sendgrid.send(message);

        return {};

    }


}
