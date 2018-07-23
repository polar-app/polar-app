const assert = require('assert');
const {Caller} = require('./Caller');

describe('Caller', function() {

    describe('Test basic caller', () => {

        it("call method and to make sure we get the right caller", async function () {
            assert.deepEqual(myCaller(), { filename: "CallerTest.js" });
        });

    });

    describe('__parse', () => {

        it("Parse a basic frame", async function () {

            let frame = "     at Function.getCaller (/home/burton/projects/polar-bookshelf/web/js/test/MyTest.js:5:17)";

            assert.deepEqual(Caller._parse(frame), { filename: "MyTest.js" });
        });


        it("Parse a webpack frame", async function () {
            let frame = "    at Object../web/js/metadata/Pagemarks.js (http://127.0.0.1:8500/web/dist/electron-bundle.js:59471:86)\n";
            assert.deepEqual(Caller._parse(frame), { filename: "Pagemarks.js" });
        });


        it("Parse a webpack frame with a question mark at the end", async function () {
            let frame = "    at eval (webpack:///./web/js/metadata/Pagemarks.js?:11:86)\n";
            assert.deepEqual(Caller._parse(frame), { filename: "Pagemarks.js" });
        });

    });

});

function myCaller() {
    // should return "myCaller"
    return Caller.getCaller();
}
