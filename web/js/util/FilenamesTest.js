"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Filenames_1 = require("./Filenames");
describe('Filenames', function () {
    describe('sanitize', function () {
        it("basic", function () {
            assert_1.default.equal(Filenames_1.Filenames.sanitize("Hello!(@#&^!~)world99"), "Hello_________world99");
        });
    });
});
//# sourceMappingURL=FilenamesTest.js.map