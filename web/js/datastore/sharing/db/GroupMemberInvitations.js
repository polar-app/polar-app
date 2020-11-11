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
exports.GroupMemberInvitations = void 0;
const Firebase_1 = require("../../../firebase/Firebase");
const Collections_1 = require("./Collections");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class GroupMemberInvitations {
    static list() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            Preconditions_1.Preconditions.assertPresent(user, 'user');
            return yield Collections_1.Collections.list(this.COLLECTION, [['to', '==', user.email]]);
        });
    }
    static listByGroupID(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            const clauses = [
                ['groupID', '==', groupID],
            ];
            return yield Collections_1.Collections.list(this.COLLECTION, clauses);
        });
    }
    static listByGroupIDAndProfileID(groupID, profileID) {
        return __awaiter(this, void 0, void 0, function* () {
            const clauses = [
                ['groupID', '==', groupID],
                ['from.profileID', '==', profileID]
            ];
            return yield Collections_1.Collections.list(this.COLLECTION, clauses);
        });
    }
    static onSnapshot(delegate) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                log.warn("No user. No notifications will be delivered");
                return;
            }
            return yield Collections_1.Collections.onQuerySnapshot(this.COLLECTION, [['to', '==', user.email]], delegate);
        });
    }
    static purge() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Collections_1.Collections.deleteByID(this.COLLECTION, () => this.list());
        });
    }
}
exports.GroupMemberInvitations = GroupMemberInvitations;
GroupMemberInvitations.COLLECTION = 'group_member_invitation';
//# sourceMappingURL=GroupMemberInvitations.js.map