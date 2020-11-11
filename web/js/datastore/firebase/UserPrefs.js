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
exports.UserPrefs = void 0;
const Prefs_1 = require("../../util/prefs/Prefs");
const Collections_1 = require("../sharing/db/Collections");
const Firebase_1 = require("../../firebase/Firebase");
const CachedFirestoreSnapshotSubscriber_1 = require("../../snapshots/CachedFirestoreSnapshotSubscriber");
class UserPrefs {
    static getUserID() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                throw new Error("No user");
            }
            return user.uid;
        });
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = yield this.getUserID();
            const userPref = yield Collections_1.Collections.getByID(this.COLLECTION, uid);
            if (userPref) {
                return new Prefs_1.DictionaryPrefs(userPref.value);
            }
            return new Prefs_1.DictionaryPrefs();
        });
    }
    static onSnapshot(firestore, uid, onSnapshot, onError) {
        const ref = firestore.collection(this.COLLECTION).doc(uid);
        const handleSnapshot = (snapshot) => {
            if (snapshot) {
                const data = snapshot.value;
                onSnapshot(data);
            }
        };
        return CachedFirestoreSnapshotSubscriber_1.createCachedFirestoreSnapshotSubscriber({
            id: 'prefs',
            ref,
            onNext: handleSnapshot,
            onError
        });
    }
    static set(prefs) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = yield this.getUserID();
            const ref = yield Collections_1.Collections.createRef(this.COLLECTION, uid);
            const userPref = {
                uid,
                value: prefs.toPrefDict()
            };
            yield ref.set(userPref);
        });
    }
}
exports.UserPrefs = UserPrefs;
UserPrefs.COLLECTION = 'user_pref';
//# sourceMappingURL=UserPrefs.js.map