import {useLogger} from "../../../../web/js/mui/MUILogger";
import React from "react";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {SignInSuccessURLs} from "./SignInSuccessURLs";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {FirebaseUIAuth} from "../../../../web/js/firebase/FirebaseUIAuth";
import firebase from 'firebase/app'
import { useHistory } from "react-router-dom";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Preconditions} from "polar-shared/src/Preconditions";

export type AuthStatus = 'needs-auth';

function handleAuthResult(authResult: firebase.auth.UserCredential, isNewUser: boolean) {

    function handleRedirect(redirectURL: string) {

        Analytics.event2('auth:handleAuthResult', {isNewUser, redirectURL});

        document.location.href = redirectURL;

    }

    if (isNewUser) {
        console.log("New user authenticated");

        Analytics.event2('new-user-signup');

        handleRedirect('/#welcome');

    } else {
        const redirectURL = SignInSuccessURLs.get() || '/';
        handleRedirect(redirectURL);
    }

}

export function useElectronWarningForGoogle() {

    const dialogs = useDialogManager();

    return React.useCallback(() => {

        if (AppRuntime.isElectron()) {

            Analytics.event2("auth:ElectronWarningForGoogle")

            dialogs.dialog({
                type: 'warning',
                title: "Desktop App Not Supported",
                body: (
                    <div>
                        Google authentication doesn't work for the Desktop App (we're working on a fix).

                        Until then, please use email authentication to login as it will send you a code to your email.
                    </div>
                ),
                onAccept: NULL_FUNCTION
            });

            return true;

        }

        return false;

    }, [dialogs]);

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

            // TODO this is no longer used and we back this out I think.

            const email = parseEmailFromLocation();

            // TODO: we need to be prompting for the user if they're attempting to login in
            // another browser session

            if (email) {

                const authResult = await firebase.auth().signInWithEmailLink(email, location.href);

                handleAuthResult(authResult, authResult.additionalUserInfo?.isNewUser || false);
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
            handleAuthResult(authResult, authResult.additionalUserInfo?.isNewUser || false);

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

    const electronWarningForGoogle = useElectronWarningForGoogle();

    return React.useCallback(async () => {

        if (electronWarningForGoogle()) {
            return;
        }

        const auth = firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: 'select_account'
        })

        Analytics.event2('auth:TriggerFirebaseGoogleAuth')
        await auth.signInWithRedirect(provider);

        FirebaseUIAuth.authWithGoogle();

    }, [electronWarningForGoogle]);

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

export async function executeCloudFunction(cloudFunctionName: string, body: any): Promise<any> {

    const url = `https://us-central1-polar-cors.cloudfunctions.net/${cloudFunctionName}/`;

    const init: RequestInit = {
        mode: "cors",
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        redirect: 'follow',
        body: JSON.stringify(body)
    };

    Analytics.event2("CloudFunctionCalled", {name: cloudFunctionName});

    const response = await fetch(url, init);

    if (response.status !== 200) {
        Analytics.event2("CloudFunctionFailed", {name: cloudFunctionName});
        throw new Error("Cloud function failed: " + response.status + ": " + response.statusText);
    }

    return await response.json();

}

export interface IStartTokenAuthResponse {
    readonly status: 'ok';
}

export function useTriggerStartTokenAuth() {

    return React.useCallback(async (email: string): Promise<IStartTokenAuthResponse> => {

        Preconditions.assertPresent(email, 'email');

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

        Preconditions.assertPresent(email, 'email');
        Preconditions.assertPresent(challenge, 'challenge');

        Analytics.event2('auth:VerifyTokenAuth');

        interface IVerifyTokenAuthResponseError {
            readonly code: 'no-email-for-challenge' | 'invalid-challenge' ;
        }

        interface IVerifyTokenAuthResponse {

            /**
             * The code / error.
             */
            readonly code: 'ok' ;

            /**
             * A generated custom token on the backend.
             */
            readonly customToken: string;

            readonly isNewUser: boolean;

        }

        const response: IVerifyTokenAuthResponse = await executeCloudFunction('VerifyTokenAuth', {
            email, challenge
        });

        Analytics.event2('auth:VerifyTokenAuthResult', {code: response.code, isNewUser: response.isNewUser});

        const auth = firebase.auth();

        if (response.code === 'ok') {

            console.log("Got response from VerifyTokenAuth and now calling signInWithCustomToken");
            const {customToken} = response;

            const userCredential = await auth.signInWithCustomToken(customToken);
            handleAuthResult(userCredential, response.isNewUser);

        }

        return response;

    }, []);

}
