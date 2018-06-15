var assert = require('assert');

const {Cmdline} = require("./Cmdline");
const {TestingTime} = require("../test/TestingTime");

TestingTime.freeze();

describe('Cmdline', function() {

    describe('getPDFArg', function() {

        it("With no data", function () {
            assert.equal(Cmdline.getPDFArg([]), null);
        });

        it("With one PDF arg", function () {
            assert.equal(Cmdline.getPDFArg(["foo.pdf"]), "foo.pdf");
        });

        it("With two PDF args", function () {
            assert.equal(Cmdline.getPDFArg(["foo.pdf", "bar.pdf"]), "bar.pdf");
        });

        it("With real args", function () {
            let args = ["/home/burton/projects/polar-bookshelf/node_modules/electron/dist/electron",".","example.pdf"];
            assert.equal(Cmdline.getPDFArg(args), "example.pdf");
        });

    });

});
