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
exports.UserGroupMembership = void 0;
const Groups_1 = require("./Groups");
const UserGroups_1 = require("./UserGroups");
class UserGroupMembership {
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const userGroup = yield UserGroups_1.UserGroups.get();
            if (!userGroup) {
                return [];
            }
            if (!userGroup.groups) {
                return [];
            }
            return yield Groups_1.Groups.getAll(userGroup.groups);
        });
    }
}
exports.UserGroupMembership = UserGroupMembership;
//# sourceMappingURL=UserGroupMembership.js.map