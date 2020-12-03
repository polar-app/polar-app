// noinspection TsLint: max-line-length

import firebase from 'firebase/app'
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
     * @param opts The opts to use when authenticating.
     */
    public static login(opts: FirebaseUIAuthOptions = {}) {

        console.log("Triggering Firebase UI auth: ", opts);

        const auth = firebase.auth();

        // **
        // this is how they suggest to do it and this is probably the BEST way
        // honestly because it removed a button click that's sort of unnecessary
        //
        // if (opts.provider) {
        //     const provider = new firebase.auth.SAMLAuthProvider(opts.provider);
        //     auth.signInWithRedirect(provider)
        //         .catch(err => console.error("Could not auth: ", err));
        //     return;
        // }

        Preconditions.assertPresent(firebaseui, 'firebaseui');
        Preconditions.assertPresent(firebaseui.auth, 'firebaseui.auth');

        const containerSelector = opts.containerSelector || '#firebaseui-auth-container';

        function computeSignInOptions() {
            if (opts.provider) {

                console.log("Authenticating with provider: " + opts.provider);

                return [
                    {
                        provider: opts.provider
                    }
                ]
            }

            // return the default provider....
            return [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    customParameters: {
                        // Forces account selection even when one account
                        // is available.
                        prompt: 'select_account'
                    }
                },

                firebase.auth.EmailAuthProvider.PROVIDER_ID,

                // Leave the lines as is for the providers you want to offer
                // your users.

                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
            ]

        }

        const signInOptions = computeSignInOptions();

        // FirebaseUI config.
        const uiConfig: firebaseui.auth.Config = {

            signInFlow: opts.signInFlow || 'redirect',
            callbacks: {

                signInSuccessWithAuthResult: (authResult: any,
                                              redirectUrl: string) => {

                    return true;

                },

            },
            queryParameterForWidgetMode: 'mode',

            signInSuccessUrl: opts.signInSuccessUrl || SIGN_IN_SUCCESS_URL,
            signInOptions,
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
        const ui = new firebaseui.auth.AuthUI(auth);
        // The start method will wait until the DOM is loaded.
        ui.start(containerSelector, uiConfig);

    }

}

export interface FirebaseUIAuthOptions {

    readonly containerSelector?: string;
    readonly signInSuccessUrl?: string;

    /**
     * The sign in flow type.  Either popup or redirect. Default is redirect.
     */
    readonly signInFlow?: 'popup' | 'redirect';

    /**
     * When provided we use a custom SAML provider with the given name.
     */
    readonly provider?: string

}
