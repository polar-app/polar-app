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
exports.Accounts = void 0;
const Firebase_1 = require("../firebase/Firebase");
const Firestore_1 = require("../firebase/Firestore");
const Logger_1 = require("polar-shared/src/logger/Logger");
const DocumentReferences_1 = require("../firebase/firestore/DocumentReferences");
const log = Logger_1.Logger.create();
const COLLECTION_NAME = "account";
var Accounts;
(function (Accounts) {
    function createRef() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                return undefined;
            }
            const firestore = yield Firestore_1.Firestore.getInstance();
            const id = user.uid;
            return firestore
                .collection(COLLECTION_NAME)
                .doc(id);
        });
    }
    Accounts.createRef = createRef;
    function get() {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = yield createRef();
            if (!ref) {
                return undefined;
            }
            const snapshot = yield DocumentReferences_1.DocumentReferences.get(ref, { source: 'server-then-cache' });
            if (!snapshot.exists) {
                return undefined;
            }
            return snapshot.data();
        });
    }
    Accounts.get = get;
    function onSnapshot(onNext, onError = ERR_HANDLER) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = yield createRef();
            if (!ref) {
                onNext(undefined);
                return;
            }
            return ref.onSnapshot(snapshot => {
                if (!snapshot.exists) {
                    return;
                }
                const account = snapshot.data();
                onNext(account);
            }, onError);
        });
    }
    Accounts.onSnapshot = onSnapshot;
    function listenForPlanUpgrades() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                return;
            }
            const firestore = yield Firestore_1.Firestore.getInstance();
            const id = user.uid;
            const ref = firestore
                .collection(COLLECTION_NAME)
                .doc(id);
            const onConfirm = () => {
                const url = new URL(document.location.href);
                url.hash = "#";
                const newLocation = url.toString();
                if (document.location.href === newLocation) {
                    document.location.reload();
                }
                else {
                    document.location.href = newLocation;
                }
            };
            let account;
            ref.onSnapshot(doc => {
                const newAccount = doc.data();
                try {
                    if (account && account.plan !== newAccount.plan) {
                    }
                }
                finally {
                    account = newAccount;
                }
            }, ERR_HANDLER);
        });
    }
    Accounts.listenForPlanUpgrades = listenForPlanUpgrades;
})(Accounts = exports.Accounts || (exports.Accounts = {}));
const ERR_HANDLER = (err) => log.error("Could not create snapshot for account: ", err);
//# sourceMappingURL=Accounts.js.map