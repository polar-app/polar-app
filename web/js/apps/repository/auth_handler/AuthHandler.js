"use strict";
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
exports.BrowserAuthHandler = exports.FirebaseAuthHandler = exports.toUserInfo = exports.AuthHandlers = void 0;
const URLs_1 = require("polar-shared/src/util/URLs");
const Firebase_1 = require("../../../firebase/Firebase");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Accounts_1 = require("../../../accounts/Accounts");
const SignInSuccessURLs_1 = require("../../../../../apps/repository/js/login/SignInSuccessURLs");
const POLAR_APP_SITES = [
    'http://localhost:8050',
    'http://127.0.0.1:8050',
    'http://localhost:8500',
    'http://127.0.0.1:8500',
    'http://localhost:9000',
    'http://127.0.0.1:9000',
    'http://localhost:9500',
    'http://127.0.0.1:9500',
    'https://app.getpolarized.io',
    'https://beta.getpolarized.io',
    'http://dev.getpolarized.io:8050'
];
function computeBaseURL() {
    const base = URLs_1.URLs.toBase(document.location.href);
    if (!POLAR_APP_SITES.includes(base)) {
        return 'https://app.getpolarized.io';
    }
    else {
        return base;
    }
}
class AuthHandlers {
    static get() {
        return new BrowserAuthHandler();
    }
}
exports.AuthHandlers = AuthHandlers;
class DefaultAuthHandler {
    constructor() {
        this.id = 'default';
    }
    userInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return Optional_1.Optional.empty();
        });
    }
}
function toUserInfo(user, account) {
    const createSubscription = () => {
        if (account) {
            return {
                plan: account.plan,
                interval: account.interval || 'month'
            };
        }
        else {
            return {
                plan: 'free',
                interval: 'month'
            };
        }
    };
    const subscription = createSubscription();
    return {
        displayName: Optional_1.Optional.of(user.displayName).getOrUndefined(),
        email: Optional_1.Optional.of(user.email).get(),
        emailVerified: user.emailVerified,
        photoURL: Optional_1.Optional.of(user.photoURL).getOrUndefined(),
        uid: user.uid,
        creationTime: user.metadata.creationTime,
        subscription
    };
}
exports.toUserInfo = toUserInfo;
class FirebaseAuthHandler extends DefaultAuthHandler {
    userInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            Firebase_1.Firebase.init();
            const user = yield this.currentUser();
            if (!user) {
                return Optional_1.Optional.empty();
            }
            const account = yield Accounts_1.Accounts.get();
            return Optional_1.Optional.of(toUserInfo(user, account));
        });
    }
    currentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return Firebase_1.Firebase.currentUser();
        });
    }
}
exports.FirebaseAuthHandler = FirebaseAuthHandler;
class BrowserAuthHandler extends FirebaseAuthHandler {
    constructor() {
        super(...arguments);
        this.id = 'browser';
    }
    authenticate(signInSuccessUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            Firebase_1.Firebase.init();
            function createLoginURL() {
                const base = computeBaseURL();
                const target = new URL('/login', base).toString();
                return SignInSuccessURLs_1.SignInSuccessURLs.createSignInURL(signInSuccessUrl, target);
            }
            const newLocation = createLoginURL();
            console.log("Redirecting to authenticate: " + newLocation);
            window.location.href = newLocation;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            Firebase_1.Firebase.init();
            const user = yield this.currentUser();
            if (user === null) {
                return {
                    user: undefined,
                    type: 'needs-authentication'
                };
            }
            return {
                user,
                type: 'authenticated'
            };
        });
    }
}
exports.BrowserAuthHandler = BrowserAuthHandler;
//# sourceMappingURL=AuthHandler.js.map