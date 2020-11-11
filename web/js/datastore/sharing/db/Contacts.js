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
exports.Contacts = void 0;
const Firebase_1 = require("../../../firebase/Firebase");
const Collections_1 = require("./Collections");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Contacts {
    static list() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            const { uid } = Preconditions_1.Preconditions.assertPresent(user, 'user');
            return yield Collections_1.Collections.list(this.COLLECTION, [['uid', '==', uid]]);
        });
    }
    static onSnapshot(delegate) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            const { uid } = Preconditions_1.Preconditions.assertPresent(user, 'user');
            return yield Collections_1.Collections.onQuerySnapshotChanges(this.COLLECTION, [['uid', '==', uid]], delegate);
        });
    }
    static purge() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Collections_1.Collections.deleteByID(this.COLLECTION, () => this.list());
        });
    }
}
exports.Contacts = Contacts;
Contacts.COLLECTION = 'contact';
//# sourceMappingURL=Contacts.js.map