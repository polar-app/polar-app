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
exports.FirebaseDatastorePrefs = void 0;
const Prefs_1 = require("../../util/prefs/Prefs");
const UserPrefs_1 = require("./UserPrefs");
const Firestore_1 = require("../../firebase/Firestore");
const Firebase_1 = require("../../firebase/Firebase");
const Latch_1 = require("polar-shared/src/util/Latch");
const Functions_1 = require("polar-shared/src/util/Functions");
class FirebaseDatastorePrefs extends Prefs_1.DictionaryPrefs {
    constructor(delegate = {}) {
        super(delegate);
        this.initLatch = new Latch_1.Latch();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.firestore = yield Firestore_1.Firestore.getInstance();
            this.user = Firebase_1.Firebase.currentUser();
            function onError(err) {
                console.error("Unable to read user prefs:", err);
            }
            function toDictionaryPrefs(userPref) {
                if (userPref) {
                    return new Prefs_1.DictionaryPrefs(userPref.value);
                }
                return new Prefs_1.DictionaryPrefs();
            }
            this.onSnapshot(userPref => {
                const prefDict = toDictionaryPrefs(userPref);
                this.update(prefDict.toPrefDict());
            }, onError);
            this.initLatch.resolve(true);
        });
    }
    onSnapshot(onNext, onError = Functions_1.NULL_FUNCTION) {
        const snapshotUnsubscriberLatch = new Latch_1.Latch();
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            yield this.initLatch.get();
            return UserPrefs_1.UserPrefs.onSnapshot(this.firestore, this.user.uid, onNext, onError);
        });
        doHandle().catch(err => onError(err));
        const result = () => {
            snapshotUnsubscriberLatch.get()
                .then(unsubscriber => unsubscriber())
                .catch(err => onError(err));
        };
        return result;
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserPrefs_1.UserPrefs.set(this);
        });
    }
    static toPersistentPrefs(userPref) {
        if (!userPref) {
            return new FirebaseDatastorePrefs({});
        }
        const dictionaryPrefs = new Prefs_1.DictionaryPrefs(userPref.value);
        return new FirebaseDatastorePrefs(dictionaryPrefs.toPrefDict());
    }
}
exports.FirebaseDatastorePrefs = FirebaseDatastorePrefs;
//# sourceMappingURL=FirebaseDatastorePrefs.js.map