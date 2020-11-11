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
exports.GroupMembers = void 0;
const Firebase_1 = require("../../../firebase/Firebase");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Collections_1 = require("./Collections");
class GroupMembers {
    static list(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            Preconditions_1.Preconditions.assertPresent(user, 'user');
            return yield Collections_1.Collections.list(this.COLLECTION, [['groupID', '==', groupID]]);
        });
    }
    static onSnapshot(groupID, delegate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Collections_1.Collections.onQuerySnapshotChanges(this.COLLECTION, [['groupID', '==', groupID]], delegate);
        });
    }
}
exports.GroupMembers = GroupMembers;
GroupMembers.COLLECTION = 'group_member';
//# sourceMappingURL=GroupMembers.js.map