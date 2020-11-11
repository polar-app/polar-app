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
const UUIDs_1 = require("./UUIDs");
const Promises_1 = require("../util/Promises");
describe('UUIDs', function () {
    it('Test UUID', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const u0 = UUIDs_1.UUIDs.create();
            yield Promises_1.Promises.waitFor(200);
            const u1 = UUIDs_1.UUIDs.create();
            chai_1.assert.notEqual(u0, u1);
            chai_1.assert.equal(UUIDs_1.UUIDs.compare(u0, u1), -1);
            chai_1.assert.equal(UUIDs_1.UUIDs.compare(u0, u0), 0);
            chai_1.assert.equal(UUIDs_1.UUIDs.compare(u1, u0), 1);
        });
    });
    describe("cmp", function () {
        it('basic', function () {
            return __awaiter(this, void 0, void 0, function* () {
                chai_1.assert.equal(UUIDs_1.UUIDs.cmp('0000', '0000'), 0);
                chai_1.assert.equal(UUIDs_1.UUIDs.cmp('0001', '0000'), 1);
                chai_1.assert.equal(UUIDs_1.UUIDs.cmp('0000', '0001'), -1);
            });
        });
    });
    describe("cmp2", function () {
        it('basic', function () {
            return __awaiter(this, void 0, void 0, function* () {
                chai_1.assert.equal(UUIDs_1.UUIDs.cmp2('0000', '0000'), 0);
                chai_1.assert.equal(UUIDs_1.UUIDs.cmp2('0001', '0000'), -1);
                chai_1.assert.equal(UUIDs_1.UUIDs.cmp2('0000', '0001'), 1);
            });
        });
    });
});
//# sourceMappingURL=UUIDsTest.js.map