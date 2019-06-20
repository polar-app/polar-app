import {assert} from 'chai';
import {Sets} from './Sets';

describe('Sets', function() {

    describe('difference', function() {

        it("Empty sets", function () {

            assert.deepEqual(Sets.difference([], []), []);

        });

        it("One element", function () {

            assert.deepEqual(Sets.difference(['a'], []), ['a']);

        });

        it("Equivalent", function () {

            assert.deepEqual(Sets.difference(['a'], ['a']), []);

        });

        it("Extra", function() {

            assert.deepEqual(Sets.difference(['a'], ['a', 'b']), []);

        });

        it("Complex", function () {

            assert.deepEqual(Sets.difference(['a', 'b'], ['a']), ['b']);

        });

    });

    describe('union', function() {

        it("duplicates", function () {

            assert.deepEqual(Sets.union([1], [1,2]), [1,2]);

        });


    });

});
