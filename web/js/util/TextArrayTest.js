"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const TextArray_1 = require("./TextArray");
describe('TextArray', function () {
    it("Create + toString 1x1", function () {
        assert_1.default.equal(new TextArray_1.TextArray(1, 1).toString(), " \n");
    });
    it("Create + toString 2x2", function () {
        assert_1.default.equal(new TextArray_1.TextArray(2, 2).toString(), "  \n  \n");
    });
    it("Create + toString 2x2", function () {
        assert_1.default.equal(new TextArray_1.TextArray(2, 2).toString(), "  \n  \n");
    });
    it("Create + toString 2x2", function () {
        let textArray = new TextArray_1.TextArray(2, 2);
        textArray.write(0, 0, 'h');
        textArray.write(1, 0, 'i');
        assert_1.default.equal(textArray.toString(), "hi\n  \n");
    });
});
//# sourceMappingURL=TextArrayTest.js.map