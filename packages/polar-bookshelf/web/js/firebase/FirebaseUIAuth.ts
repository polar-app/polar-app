// noinspection TsLint: max-line-length

import * as firebase from 'firebase/app';
import 'firebase/auth';

import * as firebaseui from 'firebaseui'
import {Preconditions} from "polar-shared/src/Preconditions";
import './FirebaseUIAuth.css';
import 'firebaseui/dist/firebaseui.css';

const SIGN_IN_SUCCESS_URL = 'http://localhost:8005/';
const TOS_URL = 'https://getpolarized.io/terms-of-service.html';
const PRIVACY_POLICY_URL = 'https://getpolarized.io/privacy-policy.html';

export class FirebaseUIAuth {

    /**
     * Start the login and render the login box to the given selector.
     *
     * @param partialOpts The opts to use when authenticating.
     */
    public static login(partialOpts: Partial<FirebaseUIAuthOptions> = {}): firebaseui.auth.AuthUI {

        console.log("Triggering Firebase UI auth");

        Preconditions.assertPresent(firebaseui, 'firebaseui');
        Preconditions.assertPresent(firebaseui.auth, 'firebaseui.auth');

        const opts = {
            containerSelector: '#firebaseui-auth-container',
            signInSuccessUrl: SIGN_IN_SUCCESS_URL,
            ...partialOpts,
        };

        // FirebaseUI config.
        const uiConfig: firebaseui.auth.Config = {

            // popupMode: true,
            // signInFlow: 'popup',

            callbacks: {

                signInSuccessWithAuthResult: (authResult: any,
                                              redirectUrl: string) => {

                    return true;

                },

            },
            queryParameterForWidgetMode: 'mode',

            signInSuccessUrl: opts.signInSuccessUrl,
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    customParameters: {
                        // Forces account selection even when one account
                        // is available.
                        prompt: 'select_account'
                    }
                },

                // Leave the lines as is for the providers you want to offer
                // your users.

                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
            ],
            // tosUrl and privacyPolicyUrl accept either url string or a
            // callback function. Terms of service url/callback.
            tosUrl: TOS_URL,

            // Privacy policy url/callback.
            privacyPolicyUrl: () => {
                window.location.assign(PRIVACY_POLICY_URL);
            }

        };

        // TODO: include metrics on teh number of authorizations started vs completed.

        // Initialize the FirebaseUI Widget using Firebase.
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start(opts.containerSelector, uiConfig);

        return ui;

    }

}

export interface FirebaseUIAuthOptions {
    readonly containerSelector: string;
    readonly signInSuccessUrl: string;
}
