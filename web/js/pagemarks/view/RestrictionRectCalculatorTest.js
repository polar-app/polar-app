var assert = require('assert');
const {assertJSON} = require("../../test/Assertions");

const {Rect} = require("../../Rect");
const {Rects} = require("../../Rects");
const {Objects} = require("../../util/Objects");

const {RestrictionRectCalculator, BoundingRect} = require("./RestrictionRectCalculator");

describe('RestrictionRectCalculator', function() {

    // https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object

    describe('RestrictionRectCalculator', function() {

        it("Basic calculation with no siblings", function () {

            let parentRect = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 500, height: 300}));

            let selfRect = Rects.createFromBasicRect(new Rect({left: 200, top: 10, width: 100, height: 100}));

            let restrictionRectCalculator = new RestrictionRectCalculator(parentRect, [], selfRect);

            assert.equal(restrictionRectCalculator.calculateBottom(), 310);

            assert.equal(restrictionRectCalculator.calculateLeft(), 10);

            assertJSON(restrictionRectCalculator.calculate(), {
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

            let sut = new RestrictionRectCalculator(parentRect, [siblingRect0], selfRect);

            assert.equal(sut.calculateBottom(), 310);

            assert.equal(sut.calculateLeft(), 110);

            assertJSON(sut.calculate(), {
                "left": 110,
                "top": 10,
                "right": 510,
                "bottom": 310,
                "width": 400,
                "height": 300
            });

        });

        it("Basic calculation with just one sibling to the left but above", function () {

            let parentRect = Rects.createFromBasicRect(  new Rect({left: 10,  top: 10,  width: 1000, height: 1000,}));

            let siblingRect0 = Rects.createFromBasicRect(new Rect({left: 10,  top: 10,  width: 100,  height: 100}));

            let selfRect = Rects.createFromBasicRect(    new Rect({left: 200, top: 200, width: 100,  height: 100}));

            let sut = new RestrictionRectCalculator(parentRect, [siblingRect0], selfRect);

            assertJSON(sut.calculate(), {
                "left": 10,
                "top": 10,
                "right": 1010,
                "bottom": 1010,
                "width": 1000,
                "height": 1000
            });

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



    describe('computeUnionBound', function() {

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


    /**
     * If we have the origin in x, y, just compute the closest bounds to x/y.
     *
     * @param elementOrigin
     * @param intersectingRects
     */
    function computeBoundingRect(parentRect, elementOrigin, intersectingRects) {

        console.log("Working with intersecting rects: " + JSON.stringify(intersectingRects, null, "  ") );

        let result = Objects.duplicate(parentRect);

        result.right = Math.min(parentRect.right, Math.min(intersectingRects.map(intersectingRect => intersectingRect.left)));

        return result;
    }

    it("Completely swallowed rect", function () {


        let parentRect = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 1000, height: 1000}))
        let elementOrigin = {x: 50, y: 50};

        let intersectingRects = [
            Rects.createFromBasicRect(new Rect({left: 100, top: 100, width: 100, height: 100}))
        ];

        assertJSON(computeBoundingRect(parentRect, elementOrigin, intersectingRects), {
        });

    });



});


