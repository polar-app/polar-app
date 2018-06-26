const assert = require('assert');
const Logger = require("./Logger").Logger;
const {TestingTime} = require("../test/TestingTime");

TestingTime.freeze();

describe('Logger', function() {

    it("", function () {

        let log = new Logger();

        assert.equal(log != null, true);

    });

});
