import {Functions} from './Functions';

const assert = require('assert');
const {Fingerprints} = require("./Fingerprints");


describe('Functions', function() {

    it("functionToScript", async function () {

        function testArg(arg: string) {
            return arg;
        }

        let script = Functions.functionToScript(testArg, "hello");

        console.log(script);

        assert.equal(script, "function testArg(arg) {\n" +
            "                return arg;\n" +
            "            }\n" +
            "testArg(\"hello\");");

    });

});
