import assert from 'assert';
import {Paths} from './Paths';

describe('Paths', function() {

    describe('basic tests', function() {

        it("no dirname", function () {

            assert.throws(function () {
                Paths.create(null!, "subdir");
            })

        });

        it("no basename", function () {

            assert.throws(function () {
                Paths.create("/", null!);
            })

        });

        it("invalid basename", function () {

            assert.throws(function () {
                Paths.create("/", "//");
            })

        });

        it("two basic paths", function () {
            assert.equal(Paths.create("/", "first"), "/first");
        });

        it("two leading slashes", function () {
            assert.equal(Paths.create("/", "/first"), "/first");
        });

        it("two leading and one trailing slash", function () {
            assert.equal(Paths.create("/cat/", "/dog"), "/cat/dog");
        });

        it("four slashes", function () {
            assert.equal(Paths.create("/cat/", "/dog/"), "/cat/dog");
        });

    });

    describe('basename', function() {

        it("basic", function () {
            assert.equal(Paths.basename("hello"), 'hello');
        });

        it("basic", function () {
            assert.equal(Paths.basename("/files/0x000"), "0x000");
        });

    });

});
