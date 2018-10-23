"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Assertions_1 = require("./test/Assertions");
const utils = require("./utils");
const { computeRangeBuffer } = require("./utils");
const { TextHighlightRows } = require("./highlights/text/controller/TextHighlightRows");
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));
describe('Test computeRectForRow for highlighting text...', function () {
    it('Test with 1 entries', function () {
        var rectElements = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            }
        ];
        var expected = { left: 0, top: 4, width: 721, height: 18, right: 721, bottom: 22 };
        chai_1.assert.deepEqual(TextHighlightRows.computeRectForRow(rectElements), expected);
    });
    it('Test with 2 entries', function () {
        var rects = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 800,
                    "bottom": 50
                },
                element: null
            }
        ];
        var expected = { left: 0, top: 4, width: 800, height: 46, right: 800, bottom: 50 };
        chai_1.assert.deepEqual(TextHighlightRows.computeRectForRow(rects), expected);
    });
});
describe('Test computeRows for highlighting text...', function () {
    it('Test with no entries', function () {
        chai_1.assert.deepEqual([], []);
    });
    it('Test with 1 entries', function () {
        var rects = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            }
        ];
        var expected = [
            [{ rect: { left: 0, top: 4, width: 721, height: 18, right: 721, bottom: 22 }, element: null }]
        ];
        chai_1.assert.deepEqual(TextHighlightRows.computeRows(rects), expected);
    });
    it('Test with 2 entries and two rows', function () {
        var rectElements = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 200,
                    "height": 20,
                    "right": 200,
                    "bottom": 24
                },
                element: null
            },
            {
                rect: {
                    "left": 200,
                    "top": 4,
                    "width": 200,
                    "height": 20,
                    "right": 400,
                    "bottom": 24
                },
                element: null
            }
        ];
        var expected = [
            [
                { rect: { left: 0, top: 4, width: 200, height: 20, right: 200, bottom: 24 }, element: null },
                { rect: { left: 200, top: 4, width: 200, height: 20, right: 400, bottom: 24 }, element: null }
            ]
        ];
        chai_1.assert.deepEqual(TextHighlightRows.computeRows(rectElements), expected);
    });
});
describe('Testing for gaps in contiguous rects', function () {
    it('Test with no entries', function () {
        var rects = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 297,
                    "height": 18,
                    "right": 297,
                    "bottom": 22
                },
                element: null
            }
        ];
        chai_1.assert.deepEqual(TextHighlightRows.computeContiguousRects([]), []);
    });
});
describe('Testing computeContiguousRects.', function () {
    it('Test with no entries', function () {
        chai_1.assert.deepEqual(TextHighlightRows.computeContiguousRects([]), []);
    });
    xit('Test with one entry', function () {
        let rects = [
            { rect: { top: 10, left: 10, bottom: 50, right: 50 }, element: null }
        ];
        let expected = [
            {
                "rect": {
                    "left": 10,
                    "top": 10,
                    "right": 50,
                    "bottom": 50,
                    "width": 40,
                    "height": 40
                },
                "rectElements": [
                    {
                        "rect": {
                            "top": 10,
                            "left": 10,
                            "bottom": 50,
                            "right": 50
                        },
                        "element": null
                    }
                ]
            }
        ];
        let actual = TextHighlightRows.computeContiguousRects(rects);
        Assertions_1.assertJSON(actual, expected);
    });
    xit('Test with two entries', function () {
        var boundingClientRects = [
            { rect: { top: 10, left: 10, bottom: 20, right: 50 }, element: null },
            { rect: { top: 50, left: 10, bottom: 70, right: 50 }, element: null }
        ];
        var expected = [
            {
                "rect": {
                    "left": 10,
                    "top": 10,
                    "right": 50,
                    "bottom": 50,
                    "width": 40,
                    "height": 40
                },
                "rectElements": [
                    {
                        "rect": {
                            "top": 10,
                            "left": 10,
                            "bottom": 20,
                            "right": 50
                        },
                        "element": null
                    }
                ]
            },
            {
                "rect": {
                    "left": 10,
                    "top": 50,
                    "right": 50,
                    "bottom": 70,
                    "width": 40,
                    "height": 20
                },
                "rectElements": [
                    {
                        "rect": {
                            "top": 50,
                            "left": 10,
                            "bottom": 70,
                            "right": 50
                        },
                        "element": null
                    }
                ]
            }
        ];
        Assertions_1.assertJSON(TextHighlightRows.computeContiguousRects(boundingClientRects), expected);
    });
});
describe('Testing createSiblingTupples.', function () {
    it('Test with no entries', function () {
        chai_1.assert.deepEqual(utils.createSiblingTuples([]), []);
    });
    it('Test with 1 entry', function () {
        chai_1.assert.deepEqual(utils.createSiblingTuples([1]), [{ curr: 1, prev: null, next: null }]);
    });
    it('Test with 2 entries', function () {
        chai_1.assert.deepEqual(utils.createSiblingTuples([1, 2]), [
            { curr: 1, prev: null, next: 2 },
            { curr: 2, prev: 1, next: null }
        ]);
    });
    it('Test with 3 entries', function () {
        chai_1.assert.deepEqual(utils.createSiblingTuples([1, 2, 3]), [
            { curr: 1, prev: null, next: 2 },
            { curr: 2, prev: 1, next: 3 },
            { curr: 3, prev: 2, next: null }
        ]);
    });
    it('Test with 4 entries', function () {
        chai_1.assert.deepEqual(utils.createSiblingTuples([1, 2, 3, 4]), [
            { curr: 1, prev: null, next: 2 },
            { curr: 2, prev: 1, next: 3 },
            { curr: 3, prev: 2, next: 4 },
            { curr: 4, prev: 3, next: null }
        ]);
    });
});
describe('Testing bounding client rect utils.', function () {
    it('Test with one element', function () {
        var boundingClientRects = [
            { top: 10, left: 10, bottom: 50, right: 50 }
        ];
        var cbr = utils.getBoundingClientRectFromBCRs(boundingClientRects);
        chai_1.assert.deepEqual(cbr, { left: 10, top: 10, bottom: 50, right: 50 });
    });
    it('Test with four elements', function () {
        var boundingClientRects = [
            { top: 10, left: 10, bottom: 50, right: 50 },
            { top: 20, left: 5, bottom: 50, right: 50 },
            { top: 30, left: 10, bottom: 55, right: 50 },
            { top: 40, left: 10, bottom: 50, right: 55 }
        ];
        var cbr = utils.getBoundingClientRectFromBCRs(boundingClientRects);
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
        var delegator = new utils.Delegator([delegate0, delegate1]);
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
    xit('Test computing the range buffers.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(computeRangeBuffer(1, 3, 1, 10), { start: 1, end: 4 });
            chai_1.assert.deepEqual(computeRangeBuffer(1, 3, 1, 3), { start: 1, end: 3 });
            chai_1.assert.deepEqual(computeRangeBuffer(3, 3, 1, 10), { start: 1, end: 6 });
        });
    });
});
//# sourceMappingURL=MainTest.js.map