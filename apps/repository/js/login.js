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
const Firebase_1 = require("../../../web/js/firebase/Firebase");
const FirebaseUIAuth_1 = require("../../../web/js/firebase/FirebaseUIAuth");
const firebase = __importStar(require("firebase/app"));
const ExternalNavigationBlock_1 = require("../../../web/js/electron/navigation/ExternalNavigationBlock");
const Analytics_1 = require("../../../web/js/analytics/Analytics");
const SignInSuccessURLs_1 = require("./login/SignInSuccessURLs");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
class InitialLogin {
    static get() {
        const key = "has-login";
        const result = localStorage.getItem(key) !== 'true';
        localStorage.setItem(key, 'true');
        return result;
    }
    static sentAnalytics() {
        if (this.get()) {
            const runtime = AppRuntime_1.AppRuntime.get();
            const category = runtime + '-login';
            Analytics_1.Analytics.event({ category, action: 'initial' });
        }
    }
}
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    Firebase_1.Firebase.init();
    if (firebase.auth().currentUser === null) {
        const signInSuccessUrl = SignInSuccessURLs_1.SignInSuccessURLs.get();
        FirebaseUIAuth_1.FirebaseUIAuth.login({ signInSuccessUrl });
    }
    InitialLogin.sentAnalytics();
}));
ExternalNavigationBlock_1.ExternalNavigationBlock.set(false);
Firebase_1.Firebase.init();
//# sourceMappingURL=login.js.map