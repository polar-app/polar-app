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
const UndoQueues_1 = require("./UndoQueues");
describe('UndoQueues', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const undo = UndoQueues_1.UndoQueues.create();
            let value = 100;
            yield undo.push(() => __awaiter(this, void 0, void 0, function* () {
                value = 101;
            }));
            yield undo.push(() => __awaiter(this, void 0, void 0, function* () {
                value = 102;
            }));
            chai_1.assert.equal(value, 102);
            chai_1.assert.equal(undo.pointer(), 1);
            yield undo.undo();
            chai_1.assert.equal(value, 101);
        });
    });
});
//# sourceMappingURL=UndoTest.js.map