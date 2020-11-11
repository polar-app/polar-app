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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountActions = void 0;
const React = __importStar(require("react"));
const Firebase_1 = require("../firebase/Firebase");
const Fetch_1 = require("polar-shared/src/util/Fetch");
const firebase = __importStar(require("firebase/app"));
require("firebase/auth");
const LoginURLs_1 = require("../apps/viewer/LoginURLs");
const Firestore_1 = require("../firebase/Firestore");
const StripeUtils_1 = require("../../../apps/repository/js/stripe/StripeUtils");
const JSONRPC_1 = require("../datastore/sharing/rpc/JSONRPC");
var AccountActions;
(function (AccountActions) {
    function logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield firebase.auth().signOut();
            const firestore = yield Firestore_1.Firestore.getInstance();
            yield firestore.terminate();
            yield firestore.clearPersistence();
        });
    }
    AccountActions.logout = logout;
    function login() {
        window.location.href = LoginURLs_1.LoginURLs.create();
    }
    AccountActions.login = login;
    function useRedirectToStripeCustomerPortal() {
        return React.useCallback(() => __awaiter(this, void 0, void 0, function* () {
            const stripeMode = StripeUtils_1.StripeUtils.stripeMode();
            const response = yield JSONRPC_1.JSONRPC.exec('StripeCreateCustomerPortal', { stripeMode });
            document.location.href = response.url;
        }), []);
    }
    AccountActions.useRedirectToStripeCustomerPortal = useRedirectToStripeCustomerPortal;
    function cancelSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = StripeUtils_1.StripeUtils.createURL(`/StripeCancelSubscription/`);
            const accountData = yield createAccountData();
            const mode = StripeUtils_1.StripeUtils.stripeMode();
            const data = Object.assign({ mode }, accountData);
            yield executeAccountMethod(url, data);
        });
    }
    AccountActions.cancelSubscription = cancelSubscription;
    function changePlan(plan, interval) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = StripeUtils_1.StripeUtils.createURL(`/StripeChangePlan/`);
            const accountData = yield createAccountData();
            const mode = StripeUtils_1.StripeUtils.stripeMode();
            const data = Object.assign({ mode, plan, interval }, accountData);
            yield executeAccountMethod(url, data);
        });
    }
    AccountActions.changePlan = changePlan;
    function executeAccountMethod(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify(data);
            const init = {
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body
            };
            const response = yield Fetch_1.Fetches.fetch(url, init);
            if (response.status !== 200) {
                throw new Error("Request: " + response.status + ": " + response.statusText);
            }
        });
    }
    function createAccountData() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                throw new Error("No account");
            }
            return {
                uid: user.uid,
                email: user.email,
            };
        });
    }
})(AccountActions = exports.AccountActions || (exports.AccountActions = {}));
//# sourceMappingURL=AccountActions.js.map