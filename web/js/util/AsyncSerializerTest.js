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
const AsyncSerializer_1 = require("./AsyncSerializer");
const chai_1 = require("chai");
const Assertions_1 = require("../test/Assertions");
const Latch_1 = require("polar-shared/src/util/Latch");
describe('AsyncSerializer', function () {
    it('with no existing entries', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = new AsyncSerializer_1.AsyncSerializer();
            let executed = false;
            yield queue.execute(() => __awaiter(this, void 0, void 0, function* () { return executed = true; }));
            chai_1.assert.ok(executed);
        });
    });
    it('with two executions and the second completing before the first', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const latch = new Latch_1.Latch();
            const queue = new AsyncSerializer_1.AsyncSerializer();
            const order = [];
            const latch0 = new Latch_1.Latch();
            const latch1 = new Latch_1.Latch();
            queue.execute(() => __awaiter(this, void 0, void 0, function* () { return yield latch0.get(); }))
                .then(() => {
                order.push(0);
            })
                .catch(err => latch.reject(err));
            queue.execute(() => __awaiter(this, void 0, void 0, function* () { return yield latch1.get(); }))
                .then(() => {
                order.push(1);
                latch.resolve(true);
            })
                .catch(err => latch.reject(err));
            latch1.resolve(true);
            latch0.resolve(true);
            yield latch.get();
            Assertions_1.assertJSON(order, [0, 1]);
        });
    });
    it('with normal failed execution not blocking us', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const latch = new Latch_1.Latch();
            const queue = new AsyncSerializer_1.AsyncSerializer();
            const order = [];
            const latch0 = new Latch_1.Latch();
            const latch1 = new Latch_1.Latch();
            let error;
            queue.execute(() => __awaiter(this, void 0, void 0, function* () { return yield latch0.get(); }))
                .catch(err => error = err);
            queue.execute(() => __awaiter(this, void 0, void 0, function* () { return yield latch1.get(); }))
                .then(() => {
                order.push(1);
                latch.resolve(true);
            })
                .catch(err => latch.reject(err));
            latch1.resolve(true);
            latch0.reject(new Error("this is an error"));
            yield latch.get();
            Assertions_1.assertJSON(order, [1]);
            chai_1.assert.equal(error !== undefined, true);
        });
    });
});
//# sourceMappingURL=AsyncSerializerTest.js.map