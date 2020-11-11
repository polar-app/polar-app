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
const chai_1 = require("chai");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Sequences_1 = require("./Sequences");
describe('Sequences', function () {
    it("Large machine and nonces", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            Sequences_1.Sequences.MACHINE = 999999999999;
            Sequences_1.Sequences.NONCE = 999999999999;
            const seq = Sequences_1.Sequences.create();
            chai_1.assert.equal(seq, "z2012-03-02T11:38:49.321Z+000000-999999999999");
        });
    });
    it("Two issued", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            Sequences_1.Sequences.MACHINE = 123;
            Sequences_1.Sequences.NONCE = 0;
            chai_1.assert.equal(Sequences_1.Sequences.create(), "z2012-03-02T11:38:49.321Z+000000-000000000123");
            chai_1.assert.equal(Sequences_1.Sequences.create(), "z2012-03-02T11:38:49.321Z+000001-000000000123");
        });
    });
    it("Small machine and nonces", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            Sequences_1.Sequences.MACHINE = 0;
            Sequences_1.Sequences.NONCE = 0;
            const seq = Sequences_1.Sequences.create();
            chai_1.assert.equal(seq, "z2012-03-02T11:38:49.321Z+000000-000000000000");
        });
    });
    it("Parse", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const input = "z2012-03-02T11:38:49.321Z+000001-100000000000";
            const sequence = Sequences_1.Sequences.parse(input);
            chai_1.assert.isDefined(sequence);
            chai_1.assert.equal(sequence === null || sequence === void 0 ? void 0 : sequence.timestamp, "2012-03-02T11:38:49.321Z");
            chai_1.assert.equal(sequence === null || sequence === void 0 ? void 0 : sequence.nonce, "000001");
            chai_1.assert.equal(sequence === null || sequence === void 0 ? void 0 : sequence.machine, "100000000000");
        });
    });
});
//# sourceMappingURL=SequencesTest.js.map