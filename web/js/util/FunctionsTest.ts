import {Functions} from './Functions';
import assert from 'assert';
import {assertJSON} from '../test/Assertions';

describe('Functions', function() {

    it("toScript from regular function", async function () {

        function testArg(arg: string) {
            return arg;
        }

        let script = Functions.functionToScript(testArg, "hello");

        console.log(script);

        assert.equal('hello', eval(script));

        assert.equal(script, "((arg) => {\n" +
            "                return arg;\n" +
            "            }\n" +
            ")(\"hello\");");

    });


    it("toScript from lambda", async function () {

        let script = Functions.functionToScript((arg: string) => {
            return arg;
        }, "hello");

        assert.equal('hello', eval(script));

        console.log(script);

        assert.equal(script, "((arg) => {\n" +
            "                return arg;\n" +
            "            }\n" +
            ")(\"hello\");");

    });

    it("toScript from static function", async function () {

        let script = Functions.functionToScript(MyClass.staticFunction, "hello");

        assert.equal('hello', eval(script));

        console.log(script);

        assert.equal(script, "((val) => {\n" +
            "        return val;\n" +
            "    }\n" +
            ")(\"hello\");");

    });

    it("basic function", async function () {

        assert.equal(basicFunction.toString(),
                     "function basicFunction(val) {\n" +
                         "    return val;\n" +
                         "}");

    });

    it("lambda function", async function () {

        assert.equal(lambaFunction.toString(),
                     "(val) => {\n" +
                         "    return val;\n" +
                         "}");

    });


    it("anonymize static function", async function () {

        assert.equal(MyClass.staticFunction.toString(),
                     "staticFunction(val) {\n" +
                         "        return val;\n" +
                         "    }");

        assert.equal(Functions._anonymizeFunction(MyClass.staticFunction.toString()),
                     "(val) {\n" +
                         "        return val;\n" +
                         "    }");

    });


    it("test inline", async function () {

        ((foo:string) => {
            console.log('foo');
        })('asdf');

    });

    function anonymizeFunction(func: string) {
        return func.indexOf('(' + 1, func.length);
    }

});

function basicFunction(val: string) {
    return val;
}

let lambaFunction = (val: string) => {
    return val;
}

class MyClass {
    static staticFunction(val: string) {
        return val;
    }
}
