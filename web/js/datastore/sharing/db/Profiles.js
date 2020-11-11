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
exports.Profiles = void 0;
const Firestore_1 = require("../../../firebase/Firestore");
const Firebase_1 = require("../../../firebase/Firebase");
const ProfileOwners_1 = require("./ProfileOwners");
const DocumentReferences_1 = require("../../../firebase/firestore/DocumentReferences");
class Profiles {
    static doc(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const doc = firestore.collection(this.COLLECTION).doc(id);
            return [id, doc];
        });
    }
    static get(id, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, ref] = yield this.doc(id);
            const doc = yield DocumentReferences_1.DocumentReferences.get(ref, opts);
            return doc.data();
        });
    }
    static resolve(profileIDRecords) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = profileIDRecords.map(current => {
                const handler = () => __awaiter(this, void 0, void 0, function* () {
                    if (current.profileID) {
                        const profile = yield this.get(current.profileID);
                        return [current, profile];
                    }
                    else {
                        return [current, undefined];
                    }
                });
                return handler();
            });
            const resolved = yield Promise.all(promises);
            return resolved.map(current => current);
        });
    }
    static currentProfile(opts = new DocumentReferences_1.CacheFirstThenServerGetOptions()) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = Firebase_1.Firebase.init();
            const user = app.auth().currentUser;
            if (!user) {
                return undefined;
            }
            const profileOwner = yield ProfileOwners_1.ProfileOwners.get(user.uid, opts);
            if (!profileOwner) {
                return undefined;
            }
            const profile = yield this.get(profileOwner.profileID, opts);
            if (!profile) {
                return undefined;
            }
            return profile;
        });
    }
}
exports.Profiles = Profiles;
Profiles.COLLECTION = 'profile';
//# sourceMappingURL=Profiles.js.map