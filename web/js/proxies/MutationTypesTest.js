"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MutationTypes_1 = require("./MutationTypes");
const MutationType_1 = require("./MutationType");
const MutationState_1 = require("./MutationState");
const assert = require('assert');
describe('MutationTypes', function () {
    describe('toMutationState', function () {
        it("basic", function () {
            assert.equal(MutationTypes_1.MutationTypes.toMutationState(MutationType_1.MutationType.INITIAL), MutationState_1.MutationState.PRESENT);
            assert.equal(MutationTypes_1.MutationTypes.toMutationState(MutationType_1.MutationType.SET), MutationState_1.MutationState.PRESENT);
            assert.equal(MutationTypes_1.MutationTypes.toMutationState(MutationType_1.MutationType.DELETE), MutationState_1.MutationState.ABSENT);
        });
    });
});
//# sourceMappingURL=MutationTypesTest.js.map