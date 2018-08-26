"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Line_1 = require("./Line");
const Assertions_1 = require("../test/Assertions");
describe('Line', function () {
    it("length", function () {
        let line = new Line_1.Line(10, 20);
        assert_1.default.equal(line.length, 10);
        let expected = {
            "start": 10,
            "end": 20,
            "length": 10
        };
        Assertions_1.assertJSON(line, expected);
    });
});
//# sourceMappingURL=LineTest.js.map