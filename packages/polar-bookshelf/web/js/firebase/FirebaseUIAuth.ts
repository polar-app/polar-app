// noinspection TsLint: max-line-length
import firebase from 'firebase/app'
import 'firebase/auth';
import * as firebaseui from 'firebaseui'
import {Preconditions} from "polar-shared/src/Preconditions";
import './FirebaseUIAuth.css';
import 'firebaseui/dist/firebaseui.css';
import {Analytics} from "../analytics/Analytics";

const SIGN_IN_SUCCESS_URL = 'http://localhost:8005/';
const TOS_URL = 'https://getpolarized.io/terms-of-service.html';
const PRIVACY_POLICY_URL = 'https://getpolarized.io/privacy-policy.html';

export namespace FirebaseUIAuth {

    /**
     * Start the login and render the login box to the given selector.
     *
     * @param opts The opts to use when authenticating.
     */
    export function login(opts: FirebaseUIAuthOptions = {}) {

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

                // https://github.com/firebase/firebaseui-web#available-callbacks

                // The signInSuccessWithAuthResult callback is invoked when user
                // signs in successfully. The authResult provided here is a
                // firebaseui.auth.AuthResult object, which includes the current
                // logged in user, the credential used to sign in the user,
                // additional user info indicating if the user is new or
                // existing and operation type like 'signIn' or 'link'. This
                // callback will replace signInSuccess in future.
                //
                // authResult: The AuthResult of successful sign-in operation.
                // The AuthResult object has same signature as
                // firebase.auth.UserCredential.

                // redirectUrl: The URL where the user is redirected after the callback
                // finishes. It will only be given if you overwrite the sign-in
                // success URL.
                //
                //
                // Should return: boolean
                //
                // If the callback returns true, then the page is automatically
                // redirected depending on the case:
                //
                // If no signInSuccessUrl parameter was given in the URL (See:
                // Overwriting the sign-in success URL) then the default
                // signInSuccessUrl in config is used.
                //
                // If the value is provided in the URL, that value will be used
                // instead of the static signInSuccessUrl in config.
                //
                // If the callback returns false or nothing, the page is not
                // automatically redirected.

                signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential,
                                              redirectUrl?: string) => {

                    if (authResult.additionalUserInfo?.isNewUser) {
                        console.log("New user authenticated");
                        Analytics.event2('new-user-signup');

                        document.location.href = '/#welcome';
                        return false;

                    }

                    if (redirectUrl) {
                        console.log("Sending to redirect URL: " + redirectUrl);
                        document.location.href = redirectUrl;
                        return false;
                    }

                    // we are returning true so it's automatically redirected to
                    // redirectUrl

                    return true;

                }

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

        // Initialize the FirebaseUI Widget using Firebase.
        const ui = new firebaseui.auth.AuthUI(auth);
        // The start method will wait until the DOM is loaded.
        ui.start(containerSelector, uiConfig);

    }

    export async function loginWithCustomToken(customToken: string) {

        Preconditions.assertPresent(firebaseui, 'firebaseui');
        Preconditions.assertPresent(firebaseui.auth, 'firebaseui.auth');

        const auth = firebase.auth();

        const userCredential = await auth.signInWithCustomToken(customToken);

    }

    interface IProviderAuthOpts {
        readonly signInSuccessUrl?: string;
    }

    // The signInSuccessWithAuthResult callback is invoked when user
    // signs in successfully. The authResult provided here is a
    // firebaseui.auth.AuthResult object, which includes the current
    // logged in user, the credential used to sign in the user,
    // additional user info indicating if the user is new or
    // existing and operation type like 'signIn' or 'link'. This
    // callback will replace signInSuccess in future.
    //
    // authResult: The AuthResult of successful sign-in operation.
    // The AuthResult object has same signature as
    // firebase.auth.UserCredential.

    // redirectUrl: The URL where the user is redirected after the callback
    // finishes. It will only be given if you overwrite the sign-in
    // success URL.
    //
    //
    // Should return: boolean
    //
    // If the callback returns true, then the page is automatically
    // redirected depending on the case:
    //
    // If no signInSuccessUrl parameter was given in the URL (See:
    // Overwriting the sign-in success URL) then the default
    // signInSuccessUrl in config is used.
    //
    // If the value is provided in the URL, that value will be used
    // instead of the static signInSuccessUrl in config.
    //
    // If the callback returns false or nothing, the page is not
    // automatically redirected.

    function signInSuccessWithAuthResult(authResult: firebase.auth.UserCredential,
                                         redirectUrl?: string) {


        if (authResult.additionalUserInfo?.isNewUser) {
            console.log("New user authenticated");
            Analytics.event2('new-user-signup');

            document.location.href = '/#welcome';
            return false;

        }

        if (redirectUrl) {
            console.log("Sending to redirect URL: " + redirectUrl);
            document.location.href = redirectUrl;
            return false;
        }

        return true;

    }

    function authWithProvider(provider: any, opts: IProviderAuthOpts = {}) {

        const auth = firebase.auth();

        // FirebaseUI config.
        const uiConfig: firebaseui.auth.Config = {

            signInFlow: 'redirect',
            callbacks: {
                signInSuccessWithAuthResult
            },
            queryParameterForWidgetMode: 'mode',

            signInSuccessUrl: opts.signInSuccessUrl || SIGN_IN_SUCCESS_URL,
            signInOptions: [
                provider
            ],
            // tosUrl and privacyPolicyUrl accept either url string or a
            // callback function. Terms of service url/callback.
            tosUrl: TOS_URL,

            // Privacy policy url/callback.
            privacyPolicyUrl: () => {
                window.location.assign(PRIVACY_POLICY_URL);
            },
            // https://github.com/firebase/firebaseui-web
            // A boolean which determines whether to immediately redirect to the
            // provider's site or instead show the default 'Sign in with
            // Provider' button when there is only a single federated provider
            // in signInOptions. In order for this option to take effect, the
            // signInOptions must only hold a single federated provider (like
            // 'google.com') and signInFlow must be set to 'redirect'.
            immediateFederatedRedirect: true

        };

        // Initialize the FirebaseUI Widget using Firebase.
        const ui = new firebaseui.auth.AuthUI(auth);

        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);

    }

    export function authWithGoogle(opts: IProviderAuthOpts = {}) {

        const provider = {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
            }
        };

        authWithProvider(provider, opts);

    }

    export function authWithEmailLink(opts: IProviderAuthOpts = {}) {

        // https://firebase.google.com/docs/auth/web/email-link-auth

        const provider = {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        };

        authWithProvider(provider, opts);

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
