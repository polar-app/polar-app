import {Functions} from './Functions';
import assert from 'assert';

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
