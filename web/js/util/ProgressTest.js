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
const ProgressCalculator_1 = require("./ProgressCalculator");
describe('ProgressTest', function () {
    it("Basic Progress", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = new ProgressCalculator_1.ProgressCalculator(4);
            chai_1.assert.equal(progress.percentage(), 0);
            progress.incr();
            chai_1.assert.equal(progress.percentage(), 25);
            progress.incr();
            progress.incr();
            progress.incr();
            chai_1.assert.equal(progress.percentage(), 100);
        });
    });
});
//# sourceMappingURL=ProgressTest.js.map