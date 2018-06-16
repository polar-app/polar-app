var assert = require('assert');

const {Filenames} = require("./Filenames");

describe('Filenames', function() {

    describe('sanitize', function() {

        it("basic", function () {
            assert.equal(Filenames.sanitize("Hello!(@#&^!~)world99"), "Hello_________world99");
        });

    });

});
