const assert = require('assert');
const {Strings} = require('./Strings');

describe('Strings', function() {

    describe('integers', function() {

        it("basic", function () {
            assert.equal(Strings.toPrimitive("0"), 0);
            assert.equal(typeof Strings.toPrimitive("0"), "number");
        });

    });

    describe('booleans', function() {

        it("basic", function () {
            assert.equal(Strings.toPrimitive("true"), true);
            assert.equal(typeof Strings.toPrimitive("true"), "boolean");

            assert.equal(Strings.toPrimitive("false"), false);
            assert.equal(typeof Strings.toPrimitive("false"), "boolean");

        });

    });

});
