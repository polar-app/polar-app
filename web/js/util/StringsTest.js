"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Strings_1 = require("./Strings");
describe('Strings', function () {
    describe('integers', function () {
        it("basic", function () {
            chai_1.assert.equal(Strings_1.Strings.toPrimitive("0"), 0);
            chai_1.assert.equal(typeof Strings_1.Strings.toPrimitive("0"), "number");
        });
    });
    describe('booleans', function () {
        it("basic", function () {
            chai_1.assert.equal(Strings_1.Strings.toPrimitive("true"), true);
            chai_1.assert.equal(typeof Strings_1.Strings.toPrimitive("true"), "boolean");
            chai_1.assert.equal(Strings_1.Strings.toPrimitive("false"), false);
            chai_1.assert.equal(typeof Strings_1.Strings.toPrimitive("false"), "boolean");
        });
    });
    describe('toUnixLineNewLines', function () {
        it("basic", function () {
            chai_1.assert.equal(Strings_1.Strings.toUnixLineNewLines('this\r\nis\r\nlong\r\n'), 'this\nis\nlong\n');
        });
    });
});
//# sourceMappingURL=StringsTest.js.map