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
exports.UserProfiles = void 0;
const Profiles_1 = require("./Profiles");
const DocumentReferences_1 = require("../../../firebase/firestore/DocumentReferences");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class UserProfiles {
    static get(profileID, opts = new DocumentReferences_1.CacheFirstThenServerGetOptions()) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserProfile = yield Profiles_1.Profiles.currentProfile(opts);
            const profile = yield Profiles_1.Profiles.get(profileID, opts);
            if (!profile) {
                return undefined;
            }
            const self = Preconditions_1.isPresent(currentUserProfile) &&
                currentUserProfile.id === profile.id;
            return { self, profile };
        });
    }
    static currentUserProfile(opts = new DocumentReferences_1.CacheFirstThenServerGetOptions()) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield Profiles_1.Profiles.currentProfile(opts);
            if (!profile) {
                return undefined;
            }
            return { self: true, profile };
        });
    }
}
exports.UserProfiles = UserProfiles;
//# sourceMappingURL=UserProfiles.js.map