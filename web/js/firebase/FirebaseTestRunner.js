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
exports.FirebaseTestRunner = void 0;
const firebase = __importStar(require("firebase/app"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const Firebase_1 = require("./Firebase");
const Functions_1 = require("polar-shared/src/util/Functions");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Preconditions_2 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
const FIREBASE_USER = process.env.FIREBASE_USER;
const FIREBASE_PASS = process.env.FIREBASE_PASS;
Preconditions_2.Preconditions.assertPresent(FIREBASE_USER, 'FIREBASE_USER');
Preconditions_2.Preconditions.assertPresent(FIREBASE_PASS, 'FIREBASE_PASS');
class FirebaseTestRunner {
    constructor(state) {
        this.currentUser = null;
        this.testingFunction = Functions_1.ASYNC_NULL_FUNCTION;
        this.state = state;
    }
    run(testingFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.testingFunction = testingFunction;
            window.addEventListener('load', () => __awaiter(this, void 0, void 0, function* () {
                this.init()
                    .catch(err => log.error("Caught error on init", err));
            }));
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = Firebase_1.Firebase.init();
            if (firebase.auth().currentUser === null) {
                yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                console.log("Authenticated with Firebase successfully.");
            }
            firebase.auth()
                .onAuthStateChanged((user) => this.onAuth(user), (err) => this.onAuthError(err));
        });
    }
    onAuth(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentUser = user;
            if (user) {
                log.notice("Working with user: " + user.email);
                const accountDetailsElement = document.getElementById("account-details");
                if (Preconditions_1.isPresent(accountDetailsElement)) {
                    accountDetailsElement.innerText = JSON.stringify(firebase.auth().currentUser, null, "  ");
                }
                yield this.testingFunction();
                mocha.run((nrFailures) => {
                    this.state.testResultWriter.write(nrFailures === 0)
                        .catch(err => console.error("Unable to write results: ", err));
                });
            }
            else {
                log.error("No user");
                yield this.state.testResultWriter.write(false);
            }
        });
    }
    onAuthError(firebaseError) {
        log.error("Firebase error: ", firebaseError);
        this.state.testResultWriter.write(false)
            .catch(err => log.error("Could not send result: ", err));
    }
}
exports.FirebaseTestRunner = FirebaseTestRunner;
//# sourceMappingURL=FirebaseTestRunner.js.map