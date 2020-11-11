"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Line_1 = require("./Line");
const Assertions_1 = require("../test/Assertions");
describe('Line', function () {
    it("length", function () {
        const line = new Line_1.Line(10, 20, 'x');
        chai_1.assert.equal(line.length, 10);
        const expected = {
            "axis": "x",
            "start": 10,
            "end": 20,
            "length": 10,
        };
        Assertions_1.assertJSON(line, expected, undefined, true);
    });
});
//# sourceMappingURL=LineTest.js.map