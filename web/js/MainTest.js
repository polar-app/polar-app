"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const utils_1 = require("./utils");
const Tuples_1 = require("polar-shared/src/util/Tuples");
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));
describe('Test computeRows for highlighting text...', function () {
    it('Test with no entries', function () {
        chai_1.assert.deepEqual([], []);
    });
});
describe('Testing createSiblingTuples.', function () {
    it('Test with no entries', function () {
        chai_1.assert.deepEqual(Tuples_1.Tuples.createSiblings([]), []);
    });
    it('Test with 1 entry', function () {
        chai_1.assert.deepEqual(Tuples_1.Tuples.createSiblings([1]), [
            { idx: 0, curr: 1, prev: undefined, next: undefined }
        ]);
    });
    it('Test with 2 entries', function () {
        chai_1.assert.deepEqual(Tuples_1.Tuples.createSiblings([1, 2]), [
            { idx: 0, curr: 1, prev: undefined, next: 2 },
            { idx: 1, curr: 2, prev: 1, next: undefined }
        ]);
    });
    it('Test with 3 entries', function () {
        chai_1.assert.deepEqual(Tuples_1.Tuples.createSiblings([1, 2, 3]), [
            { idx: 0, curr: 1, prev: undefined, next: 2 },
            { idx: 1, curr: 2, prev: 1, next: 3 },
            { idx: 2, curr: 3, prev: 2, next: undefined }
        ]);
    });
    it('Test with 4 entries', function () {
        chai_1.assert.deepEqual(Tuples_1.Tuples.createSiblings([1, 2, 3, 4]), [
            { idx: 0, curr: 1, prev: undefined, next: 2 },
            { idx: 1, curr: 2, prev: 1, next: 3 },
            { idx: 2, curr: 3, prev: 2, next: 4 },
            { idx: 3, curr: 4, prev: 3, next: undefined }
        ]);
    });
});
describe('Testing bounding client rect utils.', function () {
    it('Test with one element', function () {
        var boundingClientRects = [
            { top: 10, left: 10, bottom: 50, right: 50 }
        ];
        var cbr = utils_1.getBoundingClientRectFromBCRs(boundingClientRects);
        chai_1.assert.deepEqual(cbr, { left: 10, top: 10, bottom: 50, right: 50 });
    });
    it('Test with four elements', function () {
        var boundingClientRects = [
            { top: 10, left: 10, bottom: 50, right: 50 },
            { top: 20, left: 5, bottom: 50, right: 50 },
            { top: 30, left: 10, bottom: 55, right: 50 },
            { top: 40, left: 10, bottom: 50, right: 55 }
        ];
        var cbr = utils_1.getBoundingClientRectFromBCRs(boundingClientRects);
        chai_1.assert.deepEqual(cbr, { left: 5, top: 10, bottom: 55, right: 55 });
    });
});
describe('Testing Delegates', function () {
    it('Test basic functionality', function () {
        class MyDelegate {
            constructor() {
                this.testArg0 = null;
                this.testArg1 = null;
                this.testArg0 = null;
                this.testArg1 = null;
            }
            testFunction(testArg0, testArg1) {
                this.testArg0 = testArg0;
                this.testArg1 = testArg1;
            }
        }
        var delegate0 = new MyDelegate();
        var delegate1 = new MyDelegate();
        var delegator = new utils_1.Delegator([delegate0, delegate1]);
        delegator.apply("testFunction", "hello", "world");
        chai_1.assert.equal(delegate0.testArg0, "hello");
        chai_1.assert.equal(delegate0.testArg1, "world");
        chai_1.assert.equal(delegate1.testArg0, "hello");
        chai_1.assert.equal(delegate1.testArg1, "world");
    });
});
describe('Testing progress computation', function () {
});
describe('testing data serialization', function () {
    xit('Test basic serialization ... both ways.', function () {
    });
});
describe('testing model interaction', function () {
});
//# sourceMappingURL=MainTest.js.map