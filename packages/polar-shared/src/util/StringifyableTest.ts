import {Stringifyable} from "./Stringifyable";
import {assert} from 'chai';

describe("Stringifyable", () => {

    function doTest(val: Stringifyable) {
        const result = JSON.parse(JSON.stringify(val));
        assert.deepEqual(result, val);
    }

    it("basic", () => {

        doTest('hello');
        doTest(101);
        doTest(false);

        doTest({
            error: 'some error string'
        })

        interface ByIndexSignature {

            [key: string]: string | number |  undefined;

        }

        interface ErrorResponse {

            /**
             * Human readable error string
             */
            readonly err: string;

        }

        const errorResponse: ErrorResponse = {
            err: 'some error'
        }

        const byIndexSignature: ByIndexSignature = errorResponse;

        // //
        // // const errorResponse: ErrorResponse = {
        // //
        // // }
        //
        // doTest(<ErrorResponse> {err: 'asdf'})

    });

})
