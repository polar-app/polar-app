"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require('fs');
const Text_1 = require("./Text");
describe('Text', function () {
    it("With no input text", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Text_1.Text.indent("", "    "), "    ");
        });
    });
    it("With one line", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Text_1.Text.indent("hello\nworld", "  "), "  hello\n  world");
        });
    });
    it("With two lines", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Text_1.Text.indent("hello\nworld\n", "  "), "  hello\n  world\n  ");
        });
    });
    it("With one line withOUT newline", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Text_1.Text.indent("hello", "  "), "  hello");
        });
    });
    it("With one line WITH newline", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Text_1.Text.indent("hello\n", "  "), "  hello\n  ");
        });
    });
});
//# sourceMappingURL=TextTest.js.map