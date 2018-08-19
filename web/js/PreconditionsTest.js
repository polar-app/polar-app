"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Preconditions_1 = require("./Preconditions");
describe('Preconditions', function () {
    describe('defaultValue', function () {
        it("With null currentValue", function () {
            assert_1.default.equal(Preconditions_1.Preconditions.defaultValue(null, "hello"), "hello");
        });
        it("With undefined currentValue", function () {
            assert_1.default.equal(Preconditions_1.Preconditions.defaultValue(undefined, "hello"), "hello");
        });
        it("With existing value", function () {
            assert_1.default.equal(Preconditions_1.Preconditions.defaultValue("bye", "hello"), "bye");
        });
    });
});
//# sourceMappingURL=PreconditionsTest.js.map