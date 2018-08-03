"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Arrays_1 = require("./Arrays");
const assert_1 = __importDefault(require("assert"));
const Assertions_1 = require("../test/Assertions");
describe('Arrays', function () {
    describe('toDict', function () {
        it("pass it an array", function () {
            Assertions_1.assertJSON(Arrays_1.Arrays.toDict(["hello"]), { '0': 'hello' });
        });
        it("already a dictionary", function () {
            let expected = {
                "hello": "world"
            };
            Assertions_1.assertJSON({ hello: "world" }, expected);
        });
        it("failure", function () {
            assert_1.default.throws(() => Arrays_1.Arrays.toDict(101));
        });
    });
});
//# sourceMappingURL=ArraysTest.js.map