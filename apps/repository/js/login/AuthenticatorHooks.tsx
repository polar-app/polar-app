import {useLogger} from "../../../../web/js/mui/MUILogger";
import React from "react";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {SignInSuccessURLs} from "./SignInSuccessURLs";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {FirebaseUIAuth} from "../../../../web/js/firebase/FirebaseUIAuth";
import firebase from 'firebase/app'

export type AuthStatus = 'needs-auth';

/**
 * The function we call AFTER the redirect has been completed to test if we're now authenticated.
 */
export function useAuthHandler() {

    const logger = useLogger();
    const [status, setStatus] = React.useState<'needs-auth' |  undefined>();

    function handleAuthResult(authResult: firebase.auth.UserCredential) {

        if (authResult.additionalUserInfo?.isNewUser) {
            console.log("New user authenticated");
            Analytics.event2('new-user-signup');

            document.location.href = '/#welcome';

        } else {
            document.location.href = SignInSuccessURLs.get() || '/';
        }

    }

    async function handleEmailLink() {

        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

            const email = localStorage.getItem('emailForSignIn');

            // TODO: we need to be prompting for the user if they're attempting to login in
            // another browser session

            if (email) {
                const authResult = await firebase.auth().signInWithEmailLink(email, location.href);

                localStorage.removeItem('emailForSignIn');

                handleAuthResult(authResult);

            }

        }

    }

    async function doAsync(): Promise<AuthStatus | undefined> {

        const user = await Firebase.currentUserAsync()

        await handleEmailLink();

        if (user) {

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

    return React.useCallback(async (email: string) => {

        const auth = firebase.auth();

        await auth.sendSignInLinkToEmail(email, {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            // url: 'https://app.getpolarized.io',
            url: document.location.href,
            handleCodeInApp: true,
            dynamicLinkDomain: 'app.getpolarized.io'
        })

    }, []);

}
