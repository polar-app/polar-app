import {assert} from 'chai';
import {SetArrays} from './SetArrays';

describe('SetArrays', function() {

    describe('difference', function() {

        it("Empty sets", function() {

            assert.deepEqual(SetArrays.difference([], []), []);

        });

        it("One element", function() {

            assert.deepEqual(SetArrays.difference(['a'], []), ['a']);

        });

        it("Equivalent", function() {

            assert.deepEqual(SetArrays.difference(['a'], ['a']), []);

        });

        it("Extra", function() {

            assert.deepEqual(SetArrays.difference(['a'], ['a', 'b']), []);

        });

        it("Complex", function () {

            assert.deepEqual(SetArrays.difference(['a', 'b'], ['a']), ['b']);

        });

        it("Production test", function () {

            const currentAnnotationsIDs = [
                "14SqXCxSH7",
                "1u6HgNYwi1",
                "12ei8khyNG",
                "12ix7CTNgt"
            ];

            const newAnnotationIDs = [
                "14SqXCxSH7",
                "1u6HgNYwi1",
                "12ei8khyNG"
            ];

            const deleteIDs = SetArrays.difference(currentAnnotationsIDs, newAnnotationIDs);

            assert.equal(deleteIDs.length, 1);
            assert.equal(deleteIDs[0], '12ix7CTNgt');
        });

    });

    describe('differenceDeep', function() {

        it("Empty sets", function() {

            assert.deepEqual(SetArrays.differenceDeep([], []), []);

        });

        it("One element", function() {

            assert.deepEqual(SetArrays.differenceDeep([{a: 'a'}], []), [{a: 'a'}]);

        });

        it("Equivalent", function() {

            assert.deepEqual(SetArrays.differenceDeep([[1, 2, 3, 4]], [[1, 2, 3, 4]]), []);

        });

        it("Extra", function() {

            assert.deepEqual(SetArrays.differenceDeep([[1, 2]], [[1, 2], [3, 4]]), []);

        });

        it("Complex", function () {

            assert.deepEqual(SetArrays.differenceDeep([[1, 2, [3]], [4, 5, 6]], [[1, 2, [3]]]), [[4, 5, 6]]);

        });

        it("Production test", function () {
            const oldPositionalArrayEntries = [
                ['1', '14SqXCxSH7'],
                ['2', '1u6HgNYwi1'],
                ['3', '12ei8khyNG'],
                ['4', '324jKL234j'],
            ];

            const newPositionalArrayEntries = [
                ['1', '14SqXCxSH7'],
                ['2.5', '12ix7CTNgt'],
                ['4', '324jKL234j'],
            ];

            const deleted = SetArrays.differenceDeep(oldPositionalArrayEntries, newPositionalArrayEntries);
            const added = SetArrays.differenceDeep(newPositionalArrayEntries, oldPositionalArrayEntries);

            assert.deepEqual(deleted, [['2', '1u6HgNYwi1'], ['3', '12ei8khyNG']]);
            assert.deepEqual(added, [['2.5', '12ix7CTNgt']]);

        });
    });

    describe('union', function() {

        it("duplicates", function () {

            assert.deepEqual(SetArrays.union([1], [1, 2]), [1, 2]);

        });

    });

    describe('equal', function() {

        it("basic", function () {

            // empty arrays
            assert.ok(SetArrays.equal([], []));

            assert.isFalse(SetArrays.equal([], ['xxx']));

            assert.ok(SetArrays.equal(['y', 'x'], ['x', 'y']));

        });

    });


});
