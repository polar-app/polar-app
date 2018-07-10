const assert = require('assert');
const {assertJSON} = require("../test/Assertions");

const {Line} = require("./Line");

describe('Line', function() {

    it("length", function () {

        let line = new Line(10, 20);
        assert.equal(line.length, 10);

        let expected = {
            "start": 10,
            "end": 20,
            "length": 10
        };

        assertJSON(line, expected);

    });

});
