import {assert} from 'chai';
import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {Cmdline} from './Cmdline';

TestingTime.freeze();

describe('Cmdline', function() {

    describe('getDocArg', function() {

        it("With no data", function () {
            assert.equal(Cmdline.getDocArg([]), null);
        });

        it("With all wrong data", function () {
            assert.equal(Cmdline.getDocArg(["asdf", "bar"]), null);
        });

        it("With one PDF arg", function () {
            assert.equal(Cmdline.getDocArg(["foo.pdf"]), "foo.pdf");
        });

        it("With two PDF args", function () {
            assert.equal(Cmdline.getDocArg(["foo.pdf", "bar.pdf"]), "bar.pdf");
        });

        it("With one chtml arg", function () {
            assert.equal(Cmdline.getDocArg(["foo.chtml"]), "foo.chtml");
        });

        it("With real args", function () {
            let args = ["/home/burton/projects/polar-bookshelf/node_modules/electron/dist/electron",".","example.pdf"];
            assert.equal(Cmdline.getDocArg(args), "example.pdf");
        });

    });

    describe('getURLArg', function() {

        it("With one arg", function () {
            assert.equal(Cmdline.getURLArg(["http://www.cnn.com"]), "http://www.cnn.com");
        });

    });

});
