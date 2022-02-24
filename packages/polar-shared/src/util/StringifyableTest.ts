import {Stringifyable} from "./Stringifyable";
import {assert} from 'chai';

describe("Stringifyable", () => {

    function doTest<K>(val: Stringifyable) {
        const result = JSON.parse(JSON.stringify(val));
        assert.deepEqual(result, val);
    }

    interface ErrorResponse {

        /**
         * Human readable error string
         */
        readonly err?: string;

    }

    it("basic", () => {

        // doTest('hello');
        // doTest(101);
        // doTest(false);
        //
        doTest({
            error: 'some error string'
        })

        // doTest(<ErrorResponse> {err: 'asdf'})

        // FIXME: try keyof here...

    });

})
