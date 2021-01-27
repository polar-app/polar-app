import {AuthChallenges} from "./AuthChallenges";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {Lazy} from "../util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import { Hashcodes } from "polar-shared/src/util/Hashcodes";

export interface IVerifyTokenAuthRequest {
    readonly email: string;
    readonly challenge: string;
}

export interface IVerifyTokenAuthResponseError {
    readonly code: 'no-email-for-challenge' | 'invalid-challenge' ;
}

export interface IVerifyTokenAuthResponse {

    /**
     * The code / error.
     */
    readonly code: 'ok';

    /**
     * A generated custom token on the backend.
     */
    readonly customToken: string;

}

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

export const VerifyTokenAuthFunction = ExpressFunctions.createHookAsync(async (req, res) => {

    const request: IVerifyTokenAuthRequest = req.body;

    const {email, challenge} = request;
    const authChallenge = await AuthChallenges.get(email);

    async function sendError(response: IVerifyTokenAuthResponseError) {
        ExpressFunctions.sendResponse(res, response);
    }

    if (! authChallenge) {
        await sendError({code: 'no-email-for-challenge'});
        return;
    }

    if( authChallenge.challenge !== challenge) {
        await sendError({code: 'invalid-challenge'});
        return;
    }

    const firebase = firebaseProvider();

    const auth = firebase.auth();

    async function getOrCreateUser() {

        const user = await auth.getUserByEmail(email);
        const password = Hashcodes.createRandomID()

        if (! user) {

            return await auth.createUser({
                email,
                password
            })

        }

        return user;

    }

    const user = await getOrCreateUser();

    const customToken = await auth.createCustomToken(user.uid);

    const response: IVerifyTokenAuthResponse = {
        code: 'ok',
        customToken
    };

    ExpressFunctions.sendResponse(res, response);

});
