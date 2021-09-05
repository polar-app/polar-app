import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import {Arrays} from "./Arrays";

describe('Arrays', function() {

    describe('toDict', function() {

        it("pass it an array", function () {
            assertJSON(Arrays.toDict(["hello"]), { '0': 'hello' })
        });

        it("already a dictionary", function () {
            let expected = {
                "hello": "world"
            };
            assertJSON({hello: "world"}, expected)
        });

        it("failure", function () {
            assert.throws(() => Arrays.toDict(101));
        });

    });

    describe('toArray', function() {

        it("basic", function () {
            assertJSON(Arrays.toArray(null), []);
            assertJSON(Arrays.toArray(undefined), []);
            assertJSON(Arrays.toArray(['hello']), ['hello']);
            assertJSON(Arrays.toArray({1: 'hello'}), ['hello']);
            assertJSON(Arrays.toArray({'1': 'hello'}), ['hello']);
        });

    });

    describe('siblings', function() {

        it("basic", function () {
            assert.isUndefined(Arrays.prevSibling('a', 0))
            assert.equal(Arrays.prevSibling('ab', 1), 'a')
        });

    });

    describe('head', function() {

        it("basic", function () {
            assert.deepEqual(Arrays.head([], 0), []);
            assert.deepEqual(Arrays.head([], 1), []);
            assert.deepEqual(Arrays.head(['a'], 1), ['a']);
            assert.deepEqual(Arrays.head(['a'], 2), ['a']);
            assert.deepEqual(Arrays.head(['a', 'b'], 2), ['a', 'b']);
            assert.deepEqual(Arrays.head(['a', 'b', 'c'], 2), ['a', 'b']);
        });

    });

    describe('tail', function() {

        it("basic", function () {
            assert.deepEqual(Arrays.tail([], 0), []);
            assert.equal(Arrays.tail([], 1).length, 0);
            assert.deepEqual(Arrays.tail([], 1), []);
            assert.deepEqual(Arrays.tail(['a'], 1), ['a']);
            assert.deepEqual(Arrays.tail(['a'], 2), ['a']);
            assert.deepEqual(Arrays.tail(['a', 'b'], 2), ['a', 'b']);
            assert.deepEqual(Arrays.tail(['a', 'b', 'c'], 2), ['b', 'c']);
            assert.deepEqual(Arrays.tail(['a', 'b', 'c'], 10), ['a', 'b', 'c']);
        });

    });


});
