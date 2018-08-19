import assert from 'assert';
import {Sets} from './Sets';

describe('Sets', function() {

    it("Empty sets", function () {

        assert.deepEqual(Sets.difference([], []), []);

    });

    it("One element", function () {

        assert.deepEqual(Sets.difference(['a'], []), ['a']);

    });

    it("Equivalent", function () {

        assert.deepEqual(Sets.difference(['a'], ['a']), []);

    });

    it("Extra", function () {

        assert.deepEqual(Sets.difference(['a'], ['a', 'b']), []);

    });

    it("Complex", function () {

        assert.deepEqual(Sets.difference(['a', 'b'], ['a']), ['b']);

    });

});
