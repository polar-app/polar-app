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
exports.ProfileOwners = void 0;
const Firestore_1 = require("../../../firebase/Firestore");
const Firebase_1 = require("../../../firebase/Firebase");
const DocumentReferences_1 = require("../../../firebase/firestore/DocumentReferences");
class ProfileOwners {
    static doc(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const doc = firestore.collection(this.COLLECTION).doc(id);
            return [id, doc];
        });
    }
    static get(id, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                const user = Firebase_1.Firebase.currentUser();
                if (!user) {
                    return undefined;
                }
                id = user.uid;
            }
            const [_, ref] = yield this.doc(id);
            const doc = yield DocumentReferences_1.DocumentReferences.get(ref, opts);
            return doc.data();
        });
    }
}
exports.ProfileOwners = ProfileOwners;
ProfileOwners.COLLECTION = 'profile_owner';
//# sourceMappingURL=ProfileOwners.js.map