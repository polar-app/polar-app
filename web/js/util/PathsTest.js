"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Paths_1 = require("./Paths");
describe('Paths', function () {
    describe('basic tests', function () {
        it("no dirname", function () {
            assert_1.default.throws(function () {
                Paths_1.Paths.create(null, "subdir");
            });
        });
        it("no basename", function () {
            assert_1.default.throws(function () {
                Paths_1.Paths.create("/", null);
            });
        });
        it("invalid basename", function () {
            assert_1.default.throws(function () {
                Paths_1.Paths.create("/", "//");
            });
        });
        it("two basic paths", function () {
            assert_1.default.equal(Paths_1.Paths.create("/", "first"), "/first");
        });
        it("two leading slashes", function () {
            assert_1.default.equal(Paths_1.Paths.create("/", "/first"), "/first");
        });
        it("two leading and one trailing slash", function () {
            assert_1.default.equal(Paths_1.Paths.create("/cat/", "/dog"), "/cat/dog");
        });
        it("four slashes", function () {
            assert_1.default.equal(Paths_1.Paths.create("/cat/", "/dog/"), "/cat/dog");
        });
    });
    describe('basename', function () {
        it("basic", function () {
            assert_1.default.equal(Paths_1.Paths.basename("hello"), 'hello');
        });
        it("basic", function () {
            assert_1.default.equal(Paths_1.Paths.basename("/files/0x000"), "0x000");
        });
    });
});
//# sourceMappingURL=PathsTest.js.map