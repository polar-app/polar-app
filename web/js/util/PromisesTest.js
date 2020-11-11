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
const Promises_1 = require("./Promises");
const Latch_1 = require("polar-shared/src/util/Latch");
describe('Promises', function () {
    it("Basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
        });
    });
    describe("any", function () {
        return __awaiter(this, void 0, void 0, function* () {
            it("with one successful", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const p = new Latch_1.Latch();
                    const result = Promises_1.Promises.any(p.get());
                    p.resolve(true);
                    chai_1.assert.equal(yield result, true);
                });
            });
            it("with one rejected", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const p = new Latch_1.Latch();
                    const result = Promises_1.Promises.any(p.get());
                    p.reject(new Error("this is a fake error"));
                    yield assertThrowsAsync(() => __awaiter(this, void 0, void 0, function* () { return yield result; }));
                });
            });
            it("with two successful", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const p0 = new Latch_1.Latch();
                    const p1 = new Latch_1.Latch();
                    const result = Promises_1.Promises.any(p0.get(), p1.get());
                    p0.resolve("p0");
                    p1.resolve("p1");
                    chai_1.assert.equal(yield result, "p0");
                });
            });
            it("with first successful", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const p0 = new Latch_1.Latch();
                    const p1 = new Latch_1.Latch();
                    const result = Promises_1.Promises.any(p0.get(), p1.get());
                    p0.resolve("p0");
                    p1.reject(new Error("fake"));
                    chai_1.assert.equal(yield result, "p0");
                });
            });
            it("with second successful", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const p0 = new Latch_1.Latch();
                    const p1 = new Latch_1.Latch();
                    const result = Promises_1.Promises.any(p0.get(), p1.get());
                    p0.reject(new Error("fake"));
                    p1.resolve("p1");
                    chai_1.assert.equal(yield result, "p1");
                });
            });
            it("with both failing", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const p0 = new Latch_1.Latch();
                    const p1 = new Latch_1.Latch();
                    const result = Promises_1.Promises.any(p0.get(), p1.get());
                    p0.reject(new Error("fake"));
                    p1.reject(new Error("fake"));
                    yield assertThrowsAsync(() => __awaiter(this, void 0, void 0, function* () { return yield result; }));
                });
            });
        });
    });
});
function assertThrowsAsync(func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield func();
            chai_1.assert.isTrue(false, "Did not throw an exception.");
        }
        catch (e) {
        }
    });
}
//# sourceMappingURL=PromisesTest.js.map