"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRefs = void 0;
class UserRefs {
    static fromEmail(email) {
        return { value: email, type: 'email' };
    }
    static fromProfileID(profileID) {
        return { value: profileID, type: 'profileID' };
    }
}
exports.UserRefs = UserRefs;
//# sourceMappingURL=UserRefs.js.map