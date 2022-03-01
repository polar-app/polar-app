import {ExpressFunctions} from "../util/ExpressFunctions";
import {Lazy} from "../util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {isPresent, Preconditions} from "polar-shared/src/Preconditions";
import {UserRecord} from "firebase-functions/lib/providers/auth";
import {AuthChallengeCollection} from "polar-firebase/src/firebase/om/AuthChallengeCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {isPrivateBetaEnabled} from "polar-private-beta/src/isPrivateBetaEnabled";
import {FirebaseUserUpgrader} from "polar-firebase-users/src/FirebaseUserUpgrader";
import {
    IVerifyTokenAuthRequest,
    IVerifyTokenAuthResponse,
    IVerifyTokenAuthResponseError
} from "polar-backend-api/src/api/VerifyTokenAuth";


const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

export const VerifyTokenAuthFunction = ExpressFunctions.createHookAsync('VerifyTokenAuthFunction', async (req, res) => {

    if (req.method.toUpperCase() !== 'POST') {
        ExpressFunctions.sendResponse(res, "POST required", 500, 'text/plain');
        return;
    }

    if (!isPresent(req.body)) {
        ExpressFunctions.sendResponse(res, "No request body", 500, 'text/plain');
        return;
    }

    const request: IVerifyTokenAuthRequest = req.body;

    console.log("Handling request: ", typeof request, request);

    const {email, challenge} = request;

    Preconditions.assertPresent(email, 'email');
    Preconditions.assertPresent(challenge, 'challenge');

    const firestore = FirestoreAdmin.getInstance();
    const authChallenge = await AuthChallengeCollection.get(firestore, email);

    async function sendError(response: IVerifyTokenAuthResponseError) {
        console.error("Could not handle authentication: ", response);
        ExpressFunctions.sendResponse(res, response, 500);
    }

    if (!authChallenge) {
        await sendError({code: 'no-email-for-challenge'});
        return;
    }

    if (authChallenge.challenge !== challenge) {
        await sendError({code: 'invalid-challenge'});
        return;
    }

    const firebase = firebaseProvider();

    const auth = firebase.auth();

    async function fetchUserByEmail(email: string): Promise<UserRecord | undefined> {

        try {

            return await auth.getUserByEmail(email);

        } catch (err) {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((err as any).code === 'auth/user-not-found') {
                return undefined;
            }

            throw err;
        }

    }

    interface IAuthUser {
        readonly user: UserRecord;
        readonly isNewUser: boolean;
    }

    async function getOrCreateUser(): Promise<IAuthUser> {

        async function doCreateUser(email: string): Promise<IAuthUser> {

            const user = await FirebaseUserCreator.create(email);

            return {
                user,
                isNewUser: true
            }

        }

        const user = await fetchUserByEmail(email);

        if (!user) {
            return await doCreateUser(email);
        }

        return {user, isNewUser: false};

    }

    if (await isPrivateBetaEnabled()) {
        const authUser = await fetchUserByEmail(email);
        if (!authUser) {
            // User not found, attempt to self-register fails here because Private Beta is enabled
            await sendError({code: 'registrations-disabled'});
        }
    }

    // Private beta is not enabled. Proceed with normal "login || auto-register" flow
    const authUser = await getOrCreateUser();

    const customToken = await auth.createCustomToken(authUser.user.uid);

    const response: IVerifyTokenAuthResponse = {
        code: 'ok',
        customToken,
        isNewUser: authUser.isNewUser
    };

    // we now need to upgrade this users account before they are authenticated,
    // so that they have all the data they need.
    await FirebaseUserUpgrader.upgrade(authUser.user.uid);

    // set a session token with the user's UID so that the request is unique for
    // SSR so that it doesn't mess with the cache.  Note that we have to clear
    // this on logout but we purge all cookies right now anyway on logout.
    res.cookie('__session', authUser.user.uid, {maxAge: 9999999999999, httpOnly: true});

    ExpressFunctions.sendResponse(res, response);

});
