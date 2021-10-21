import {assert} from 'chai';
import {Errors} from './Errors';

describe('Errors', function() {

    it("basic", function() {

        try {

            Errors.rethrow(new Error("root cause: "), "rethrow cause: ");

            assert.ok(false, "Should not have reached here");

        } catch (e) {
            assert.equal((e as any).msg, "rethrow cause: : root cause: ");
        }

    });

});