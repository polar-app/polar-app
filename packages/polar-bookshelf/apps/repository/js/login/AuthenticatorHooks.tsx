import {useLogger} from "../../../../web/js/mui/MUILogger";
import React from "react";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {SignInSuccessURLs} from "./SignInSuccessURLs";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {FirebaseUIAuth} from "../../../../web/js/firebase/FirebaseUIAuth";
import firebase from 'firebase/app'
import { useHistory } from "react-router-dom";
import { Fetches } from "polar-shared/src/util/Fetch";

export type AuthStatus = 'needs-auth';

function handleAuthResult(authResult: firebase.auth.UserCredential) {

    if (authResult.additionalUserInfo?.isNewUser) {
        console.log("New user authenticated");
        Analytics.event2('new-user-signup');

        document.location.href = '/#welcome';

    } else {
        document.location.href = SignInSuccessURLs.get() || '/';
    }

}

/**
 * The function we call AFTER the redirect has been completed to test if we're now authenticated.
 */
export function useAuthHandler() {

    const logger = useLogger();
    const [status, setStatus] = React.useState<'needs-auth' |  undefined>();

    async function handleEmailLink(): Promise<boolean> {

        function parseEmailFromLocation(): string | undefined {
            const url = new URL(document.location.href);
            return url.searchParams.get('email') || undefined;
        }

        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

            const email = parseEmailFromLocation();

            // TODO: we need to be prompting for the user if they're attempting to login in
            // another browser session

            if (email) {
                const authResult = await firebase.auth().signInWithEmailLink(email, location.href);

                handleAuthResult(authResult);
                return true;

            }

        }

        return false;

    }

    async function doAsync(): Promise<AuthStatus | undefined> {

        const user = await Firebase.currentUserAsync()

        const handledEmailLink = await handleEmailLink();

        if (handledEmailLink) {
            // noop
        } else if (user) {

            const auth = firebase.auth();

            const authResult = await auth.getRedirectResult();
            handleAuthResult(authResult);

        } else {
            setStatus('needs-auth');
        }

        return status;

    }

    doAsync()
        .catch(err => logger.error("Can not authenticate: ", err));

    return status;

}

export function useTriggerFirebaseGoogleAuth() {

    /// https://firebase.google.com/docs/auth/web/google-signin

    return React.useCallback(async () => {

        const auth = firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: 'select_account'
        })

        await auth.signInWithRedirect(provider);

        FirebaseUIAuth.authWithGoogle();

    }, []);

}

export function useTriggerFirebaseEmailAuth() {

    const history = useHistory();

    return React.useCallback(async (email: string) => {

        const auth = firebase.auth();

        // TODO: an alternative here is to do this on the backend and call the
        // function ourselves but it's somewhat annoying.

        // push a new history state into the path with ?email = so that
        function createLocationWithEmail() {
            const url = new URL(document.location.href);
            url.searchParams.set('email', email);
            return `${url.pathname}${url.search}${url.hash}`;
        }

        const locationWithEmail = createLocationWithEmail();

        history.push(locationWithEmail);

        await auth.sendSignInLinkToEmail(email, {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            // url: 'https://app.getpolarized.io',
            url: document.location.href,
            handleCodeInApp: true,
            dynamicLinkDomain: 'app.getpolarized.io'
        })

    }, [history]);

}

export async function executeCloudFunction(name: string, data: any): Promise<any> {

    const url = `https://us-central1-polar-cors.cloudfunctions.net/${name}/`;

    const body = JSON.stringify(data);

    const init = {
        mode: "cors",
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body
    };

    const response = await Fetches.fetch(url, init as any);

    if (response.status !== 200) {
        throw new Error("Cloud function failed: " + response.status + ": " + response.statusText);
    }

    return await response.json();

}

export interface IStartTokenAuthResponse {
    readonly status: 'ok';
}

export function useTriggerStartTokenAuth() {

    return React.useCallback(async (email: string): Promise<IStartTokenAuthResponse> => {

        return await executeCloudFunction('StartTokenAuth', {
            email
        });

    }, []);

}

export interface IVerifyTokenAuthResponseError {
    readonly code: 'no-email-for-challenge' | 'invalid-challenge';
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

export function useTriggerVerifyTokenAuth() {

    return React.useCallback(async (email: string, challenge: string): Promise<IVerifyTokenAuthResponse | IVerifyTokenAuthResponseError> => {

        const response = await executeCloudFunction('VerifyTokenAuth', {
            email, challenge
        });

        const auth = firebase.auth();

        if (response.code === 'ok') {
            const {customToken} = response;
            const userCredential = await auth.signInWithCustomToken(customToken);
            handleAuthResult(userCredential);
        }

        return response;

    }, []);

}