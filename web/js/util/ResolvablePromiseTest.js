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
const ResolvablePromise_1 = require("./ResolvablePromise");
describe('ResolvablePromise', function () {
    it("Without awaiting the promise", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvablePromise = new ResolvablePromise_1.ResolvablePromise();
            resolvablePromise.resolve('hello');
            chai_1.assert.equal(yield resolvablePromise, 'hello');
        });
    });
    it("double await", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvablePromise = new ResolvablePromise_1.ResolvablePromise();
            resolvablePromise.resolve('hello');
            chai_1.assert.equal(yield resolvablePromise, 'hello');
            chai_1.assert.equal(yield resolvablePromise, 'hello');
        });
    });
    it('reject2', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let resolve = () => { };
            let reject = () => { };
            const promise = new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            });
            let failures = 0;
            promise.catch(err => ++failures);
            promise.catch(err => ++failures);
            reject(new Error("it broke"));
            try {
                yield promise;
            }
            catch (e) {
                ++failures;
            }
            chai_1.assert.equal(failures, 3);
            promise.catch(err => ++failures);
            try {
                yield promise;
            }
            catch (e) {
                ++failures;
            }
            chai_1.assert.equal(failures, 5);
        });
    });
});
//# sourceMappingURL=ResolvablePromiseTest.js.map