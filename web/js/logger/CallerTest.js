const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const {Caller} = require('./Caller');

describe('Caller', function() {

    describe('Test basic caller', () => {

        it("call method and to make sure we get the right caller", async function () {
            assert.deepEqual(myCaller(), { filename: "CallerTest.js" });
        });

    });

    describe('__parse', () => {

        it("Parse a basic frame", async function () {

            let frame = "     at Function.getCaller (/home/burton/projects/polar-bookshelf/web/js/logger/CallerTest.js:5:17)";

            assert.deepEqual(Caller._parse(frame), { filename: "CallerTest.js" });
        });

    });

});

//

function myCaller() {
    // should return "myCaller"
    return Caller.getCaller();
}
