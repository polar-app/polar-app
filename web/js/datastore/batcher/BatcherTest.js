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
const Batcher_1 = require("./Batcher");
const Assertions_1 = require("../../test/Assertions");
describe('Batcher', function () {
    it("Verify first active and then passive batches.", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let mockExecutor = new MockExecutor();
            let batcher = new Batcher_1.Batcher(() => mockExecutor.execute());
            let b0 = batcher.enqueue();
            let b1 = batcher.enqueue();
            chai_1.assert.ok(b0 instanceof Batcher_1.ActiveBatch);
            chai_1.assert.ok(b1 instanceof Batcher_1.PassiveBatch);
        });
    });
    it("Stats across iterations", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let mockExecutor = new MockExecutor();
            let batcher = new Batcher_1.Batcher(() => mockExecutor.execute());
            let b0 = batcher.enqueue();
            let b1 = batcher.enqueue();
            let b2 = batcher.enqueue();
            chai_1.assert.equal(mockExecutor.completions.length, 3);
            mockExecutor.completions.forEach(completion => completion.resolve());
            yield b0.run();
            chai_1.assert.equal(b0.ticket.executed, true);
            Assertions_1.assertJSON(b0, {
                "batched": 3,
                "batches": 1,
                "ticketsPerBatch": [
                    3
                ],
                "tickets": [],
                "ticket": {
                    "executed": true,
                    "promise": {}
                }
            });
            chai_1.assert.equal(b1.ticket.executed, true);
            chai_1.assert.equal(b2.ticket.executed, true);
        });
    });
});
class MockExecutor {
    constructor() {
        this.completions = [];
        this.resolve = false;
        this.reject = false;
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.resolve) {
                resolve();
                return;
            }
            if (this.reject) {
                reject(new Error("Rejecting result"));
                return;
            }
            this.completions.push({ resolve, reject });
        });
    }
}
//# sourceMappingURL=BatcherTest.js.map