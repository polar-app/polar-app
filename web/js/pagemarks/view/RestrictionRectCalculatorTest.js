var assert = require('assert');
const {assertJSON} = require("../../test/Assertions");

const {Rect} = require("../../Rect");
const {Rects} = require("../../Rects");

const {RestrictionRectCalculator, BoundingRect} = require("./RestrictionRectCalculator");

describe('RestrictionRectCalculator', function() {

    // https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object

    describe('BoundingRect', function() {

        it("Basic calculation with no siblings", function () {

            let parentRect = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 500, height: 300}));

            let selfRect = Rects.createFromBasicRect(new Rect({left: 200, top: 10, width: 100, height: 100}));

            let boundingRect = new BoundingRect(parentRect, [], selfRect);

            assert.equal(boundingRect.calculateBottom(), 310);

            assert.equal(boundingRect.calculateLeft(), 10);

            assertJSON(boundingRect.calculate(), {
                "left": 10,
                "top": 10,
                "right": 510,
                "bottom": 310,
                "width": 500,
                "height": 300
            });

        });


        it("Basic calculation with just one sibling to the left", function () {

            let parentRect = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 500, height: 300}));

            let siblingRect0 = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 100, height: 100}));

            let selfRect = Rects.createFromBasicRect(new Rect({left: 200, top: 10, width: 100, height: 100}));

            let boundingRect = new BoundingRect(parentRect, [siblingRect0], selfRect);

            assert.equal(boundingRect.calculateBottom(), 310);

            assert.equal(boundingRect.calculateLeft(), 110);

            assertJSON(boundingRect.calculate(), {
                "left": 110,
                "top": 10,
                "right": 510,
                "bottom": 310,
                "width": 400,
                "height": 300
            });

        });

        it("Basic calculation with just one sibling to the left but above", function () {

            let parentRect = Rects.createFromBasicRect(  new Rect({left: 10,  top: 10,  width: 1000, height: 1000, right: 1010, bottom: 1010}));

            let siblingRect0 = Rects.createFromBasicRect(new Rect({left: 10,  top: 10,  width: 100,  height: 100,  right: 110,  bottom: 110}));

            let selfRect = Rects.createFromBasicRect(    new Rect({left: 200, top: 200, width: 100,  height: 100,  right: 300,  bottom: 300}));

            let boundingRect = new BoundingRect(parentRect, [siblingRect0], selfRect);

            let left = boundingRect.calculateLeft();

            // assertJSON(boundingRect.calculate(), {
            //     "left": 10,
            //     "top": 110,
            //     "right": 1000,
            //     "bottom": 1000,
            //     "width": 400,
            //     "height": 300
            // });

        });


        it("Basic calculation with just four siblings (one for each side)", function () {

            // let parentRect = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 1000, height: 1000}));
            //
            // let leftSibling = Rects.createFromBasicRect(new Rect({left: 0, top: 400, width: 100, height: 100}));
            // let rightSibling = Rects.createFromBasicRect(new Rect({left: 0, top: 400, width: 100, height: 100}));
            // let leftSibling = Rects.createFromBasicRect(new Rect({left: 0, top: 400, width: 100, height: 100}));
            // let leftSibling = Rects.createFromBasicRect(new Rect({left: 0, top: 400, width: 100, height: 100}));
            //
            // // stick self right in the middle.
            // let selfRect = Rects.createFromBasicRect(new Rect({left: 500, top: 500, width: 10, height: 10}));
            //
            // let boundingRect = new BoundingRect(parentRect, [siblingRect0], selfRect);
            //
            // assert.equal(boundingRect.calculateBottom(), 1010);
            //
            // assert.equal(boundingRect.calculateLeft(), 100);
            //
            // assertJSON(boundingRect.calculate(), {
            //     "left": 100,
            //     "top": 10,
            //     "right": 1010,
            //     "bottom": 1010,
            //     "width": 910,
            //     "height": 1000
            // });
            //
        });

        // FIXME: with two siblings to the left and we're picking the LARGER of them...

    });

    // BASIC vertically overlap functions to test just the filters...

    describe('Line Intersects', function() {

        /**
         *
         * @param line0 {Array<number>}
         * @param line1 {Array<number>}
         * @return {boolean}
         */
        function lineIntersects(line0, line1) {
            return line0[0] < line1[1] && line0[1] > line1[0]
        }

        it("Test 1", function () {
            assert.equal(lineIntersects([3,5], [4,6]), true)
        });

        it("Test 2", function () {
            assert.equal(lineIntersects([4,6], [3,5]), true)
        });

        it("Test 3", function () {
            assert.equal(lineIntersects([4,6], [8,10]), false)
        });

        it("Test 4", function () {
            assert.equal(lineIntersects([4,6], [5,10]), true)
        });

    });

});
