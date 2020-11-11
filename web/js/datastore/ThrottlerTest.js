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
const Throttler_1 = require("./Throttler");
const Promises_1 = require("../util/Promises");
describe('Throttler', function () {
    describe('by maxRequests', function () {
        it("basic with one request throttled", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let resolved = false;
                const throttler = new Throttler_1.Throttler(() => resolved = true, { maxRequests: 1, maxTimeout: 99999999 });
                chai_1.assert.equal(resolved, false);
                throttler.exec();
                chai_1.assert.equal(resolved, false);
                throttler.exec();
                chai_1.assert.equal(resolved, true);
            });
        });
        it("no requests throttled", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let resolved = false;
                const throttler = new Throttler_1.Throttler(() => resolved = true, { maxRequests: 0, maxTimeout: 99999999 });
                chai_1.assert.equal(resolved, false);
                throttler.exec();
                chai_1.assert.equal(resolved, true);
            });
        });
        it("two requests throttled", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let resolved = false;
                const throttler = new Throttler_1.Throttler(() => resolved = true, { maxRequests: 2, maxTimeout: 99999999 });
                chai_1.assert.equal(resolved, false);
                throttler.exec();
                chai_1.assert.equal(resolved, false);
                throttler.exec();
                chai_1.assert.equal(resolved, false);
                throttler.exec();
                chai_1.assert.equal(resolved, true);
            });
        });
    });
    describe('by time', function () {
        it("basic with one request throttled", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let resolved = 0;
                const throttler = new Throttler_1.Throttler(() => ++resolved, { maxRequests: 9999, maxTimeout: 1000 });
                chai_1.assert.equal(resolved, 0);
                throttler.exec();
                chai_1.assert.equal(resolved, 0);
                throttler.exec();
                throttler.exec();
                throttler.exec();
                throttler.exec();
                throttler.exec();
                throttler.exec();
                throttler.exec();
                yield Promises_1.Promises.waitFor(1010);
                chai_1.assert.equal(resolved, 1);
            });
        });
    });
});
//# sourceMappingURL=ThrottlerTest.js.map