"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const TestingTime_1 = require("../test/TestingTime");
const Cmdline_1 = require("./Cmdline");
TestingTime_1.TestingTime.freeze();
describe('Cmdline', function () {
    describe('getDocArg', function () {
        it("With no data", function () {
            assert_1.default.equal(Cmdline_1.Cmdline.getDocArg([]), null);
        });
        it("With all wrong data", function () {
            assert_1.default.equal(Cmdline_1.Cmdline.getDocArg(["asdf", "bar"]), null);
        });
        it("With one PDF arg", function () {
            assert_1.default.equal(Cmdline_1.Cmdline.getDocArg(["foo.pdf"]), "foo.pdf");
        });
        it("With two PDF args", function () {
            assert_1.default.equal(Cmdline_1.Cmdline.getDocArg(["foo.pdf", "bar.pdf"]), "bar.pdf");
        });
        it("With one chtml arg", function () {
            assert_1.default.equal(Cmdline_1.Cmdline.getDocArg(["foo.chtml"]), "foo.chtml");
        });
        it("With real args", function () {
            let args = ["/home/burton/projects/polar-bookshelf/node_modules/electron/dist/electron", ".", "example.pdf"];
            assert_1.default.equal(Cmdline_1.Cmdline.getDocArg(args), "example.pdf");
        });
    });
    describe('getURLArg', function () {
        it("With one arg", function () {
            assert_1.default.equal(Cmdline_1.Cmdline.getURLArg(["http://www.cnn.com"]), "http://www.cnn.com");
        });
    });
});
//# sourceMappingURL=CmdlineTest.js.map