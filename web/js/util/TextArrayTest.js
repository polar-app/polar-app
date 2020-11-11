"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TextArray_1 = require("./TextArray");
describe('TextArray', function () {
    it("Create + toString 1x1", function () {
        chai_1.assert.equal(new TextArray_1.TextArray(1, 1).toString(), " \n");
    });
    it("Create + toString 2x2", function () {
        chai_1.assert.equal(new TextArray_1.TextArray(2, 2).toString(), "  \n  \n");
    });
    it("Create + toString 2x2", function () {
        chai_1.assert.equal(new TextArray_1.TextArray(2, 2).toString(), "  \n  \n");
    });
    it("Create + toString 2x2", function () {
        let textArray = new TextArray_1.TextArray(2, 2);
        textArray.write(0, 0, 'h');
        textArray.write(1, 0, 'i');
        chai_1.assert.equal(textArray.toString(), "hi\n  \n");
    });
});
//# sourceMappingURL=TextArrayTest.js.map