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
exports.ProfileJoins = void 0;
const Profiles_1 = require("./Profiles");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
class ProfileJoins {
    static record(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value) {
                return undefined;
            }
            const joined = yield this.join([value]);
            if (joined.length > 0) {
                return joined[0];
            }
            return undefined;
        });
    }
    static join(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedProfiles = {};
            const promises = values.map(value => {
                const handler = () => __awaiter(this, void 0, void 0, function* () {
                    const { profileID } = value;
                    if (!profileID) {
                        return;
                    }
                    const profile = yield Profiles_1.Profiles.get(profileID);
                    if (profile) {
                        resolvedProfiles[profileID] = profile;
                    }
                });
                return handler();
            });
            yield Promise.all(promises);
            return values.map((value) => {
                const { profileID } = value;
                const profile = profileID ? Optional_1.Optional.of(resolvedProfiles[profileID]).getOrUndefined() : undefined;
                return {
                    value,
                    profile,
                    profileID
                };
            });
        });
    }
}
exports.ProfileJoins = ProfileJoins;
//# sourceMappingURL=ProfileJoins.js.map