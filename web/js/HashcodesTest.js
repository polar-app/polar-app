"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Hashcodes_1 = require("./Hashcodes");
describe('Hashcodes', function () {
    describe('create', function () {
        it("basic", function () {
            let hashcode = Hashcodes_1.Hashcodes.create("asdf");
            assert_1.default.equal(hashcode, "1aibZzMnnHwqHd9cmMb2QrRdgyBj5ppNHgCTqxqggN8KRN4jtu");
        });
    });
});
//# sourceMappingURL=HashcodesTest.js.map