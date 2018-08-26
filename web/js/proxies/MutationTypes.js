"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MutationType_1 = require("./MutationType");
const MutationState_1 = require("./MutationState");
class MutationTypes {
    static toMutationState(mutationType) {
        switch (mutationType) {
            case MutationType_1.MutationType.INITIAL:
                return MutationState_1.MutationState.PRESENT;
            case MutationType_1.MutationType.SET:
                return MutationState_1.MutationState.PRESENT;
            case MutationType_1.MutationType.DELETE:
                return MutationState_1.MutationState.ABSENT;
            default:
                throw new Error("Invalid mutationType: " + mutationType);
        }
    }
}
exports.MutationTypes = MutationTypes;
//# sourceMappingURL=MutationTypes.js.map