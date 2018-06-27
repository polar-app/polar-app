const assert = require('assert');
const Logger = require("./Logger").Logger;
const {TestingTime} = require("../test/TestingTime");

TestingTime.freeze();

describe('Logger', function() {

    it("basic", function () {

        // FIXME: we can't capture console output I think but maybe I can figure
        // out in the future how to write it to a specific file.

        const log = Logger.create();

        assert.equal(log != null, true);

    });

});
