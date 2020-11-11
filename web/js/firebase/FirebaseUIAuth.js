"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseUIAuth = void 0;
const firebase = __importStar(require("firebase/app"));
require("firebase/auth");
const firebaseui = __importStar(require("firebaseui"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
require("./FirebaseUIAuth.css");
require("firebaseui/dist/firebaseui.css");
const SIGN_IN_SUCCESS_URL = 'http://localhost:8005/';
const TOS_URL = 'https://getpolarized.io/terms-of-service.html';
const PRIVACY_POLICY_URL = 'https://getpolarized.io/privacy-policy.html';
class FirebaseUIAuth {
    static login(opts = {}) {
        console.log("Triggering Firebase UI auth: ", opts);
        const auth = firebase.auth();
        Preconditions_1.Preconditions.assertPresent(firebaseui, 'firebaseui');
        Preconditions_1.Preconditions.assertPresent(firebaseui.auth, 'firebaseui.auth');
        const containerSelector = opts.containerSelector || '#firebaseui-auth-container';
        function computeSignInOptions() {
            if (opts.provider) {
                console.log("Authenticating with provider: " + opts.provider);
                return [
                    {
                        provider: opts.provider
                    }
                ];
            }
            return [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    customParameters: {
                        prompt: 'select_account'
                    }
                },
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ];
        }
        const signInOptions = computeSignInOptions();
        const uiConfig = {
            signInFlow: opts.signInFlow || 'redirect',
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    return true;
                },
            },
            queryParameterForWidgetMode: 'mode',
            signInSuccessUrl: opts.signInSuccessUrl || SIGN_IN_SUCCESS_URL,
            signInOptions,
            tosUrl: TOS_URL,
            privacyPolicyUrl: () => {
                window.location.assign(PRIVACY_POLICY_URL);
            }
        };
        const ui = new firebaseui.auth.AuthUI(auth);
        ui.start(containerSelector, uiConfig);
    }
}
exports.FirebaseUIAuth = FirebaseUIAuth;
//# sourceMappingURL=FirebaseUIAuth.js.map