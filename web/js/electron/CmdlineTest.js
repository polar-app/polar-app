"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Cmdline_1 = require("./Cmdline");
TestingTime_1.TestingTime.freeze();
describe('Cmdline', function () {
    describe('getDocArg', function () {
        it("With no data", function () {
            chai_1.assert.equal(Cmdline_1.Cmdline.getDocArg([]), null);
        });
        it("With all wrong data", function () {
            chai_1.assert.equal(Cmdline_1.Cmdline.getDocArg(["asdf", "bar"]), null);
        });
        it("With one PDF arg", function () {
            chai_1.assert.equal(Cmdline_1.Cmdline.getDocArg(["foo.pdf"]), "foo.pdf");
        });
        it("With two PDF args", function () {
            chai_1.assert.equal(Cmdline_1.Cmdline.getDocArg(["foo.pdf", "bar.pdf"]), "bar.pdf");
        });
        it("With one chtml arg", function () {
            chai_1.assert.equal(Cmdline_1.Cmdline.getDocArg(["foo.chtml"]), "foo.chtml");
        });
        it("With real args", function () {
            let args = ["/home/burton/projects/polar-bookshelf/node_modules/electron/dist/electron", ".", "example.pdf"];
            chai_1.assert.equal(Cmdline_1.Cmdline.getDocArg(args), "example.pdf");
        });
    });
    describe('getURLArg', function () {
        it("With one arg", function () {
            chai_1.assert.equal(Cmdline_1.Cmdline.getURLArg(["http://www.cnn.com"]), "http://www.cnn.com");
        });
    });
});
//# sourceMappingURL=CmdlineTest.js.map