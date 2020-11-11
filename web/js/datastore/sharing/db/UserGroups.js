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
exports.NullUserGroup = exports.UserGroups = void 0;
const Firestore_1 = require("../../../firebase/Firestore");
const Firebase_1 = require("../../../firebase/Firebase");
const Collections_1 = require("./Collections");
const Functions_1 = require("polar-shared/src/util/Functions");
class UserGroups {
    static get(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uid) {
                const user = Firebase_1.Firebase.currentUser();
                if (!user) {
                    return undefined;
                }
                uid = user.uid;
            }
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(this.COLLECTION).doc(uid);
            const doc = yield ref.get();
            return this.fromRaw(doc.data());
        });
    }
    static onSnapshot(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                return Functions_1.NULL_FUNCTION;
            }
            return yield Collections_1.Collections.onDocumentSnapshot(this.COLLECTION, user.uid, userGroupRaw => {
                handler(this.fromRaw(userGroupRaw));
            });
        });
    }
    static hasPermissionForGroup(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userGroup = yield UserGroups.get();
            if (!userGroup) {
                return false;
            }
            if (!userGroup.groups.includes(groupID)) {
                return false;
            }
            if (!userGroup.invitations.includes(groupID)) {
                return false;
            }
            return true;
        });
    }
    static hasAdminForGroup(groupID, userGroup) {
        if (!userGroup) {
            return false;
        }
        if (!userGroup.admin) {
            return false;
        }
        return userGroup.admin.includes(groupID);
    }
    static fromRaw(userGroupRaw) {
        if (userGroupRaw) {
            return {
                uid: userGroupRaw.uid,
                groups: userGroupRaw.groups || [],
                invitations: userGroupRaw.invitations || [],
                admin: userGroupRaw.admin || [],
                moderator: userGroupRaw.moderator || []
            };
        }
        return undefined;
    }
}
exports.UserGroups = UserGroups;
UserGroups.COLLECTION = 'user_group';
class NullUserGroup {
    constructor(uid) {
        this.uid = uid;
        this.groups = [];
        this.invitations = [];
        this.admin = [];
        this.moderator = [];
    }
}
exports.NullUserGroup = NullUserGroup;
//# sourceMappingURL=UserGroups.js.map