
const assert = require('assert');
const {assertJSON} = require("../../../test/Assertions");

const {Rect} = require("../../../Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {RectArt} = require("../../../util/RectArt");

const {RectAdjacencyCalculator} = require("./RectAdjacencyCalculator");

describe('RectAdjacencyCalculator', function() {

    // FIXME: test the snapping direction... do we snap before or after the primary

    it("Primary coming from the right, horizontal (snapping after)", function () {

        let primaryRect = Rects.createFromBasicRect({left: 16, top: 10, width: 10, height: 10});

        let secondaryRect = Rects.createFromBasicRect({left: 10, top: 10, width: 10, height: 10});

        console.log("BEFORE: " + RectArt.formatRects([secondaryRect, primaryRect]).toString());

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        console.log("AFTER: " + RectArt.formatRects([secondaryRect, adjacency.adjustedRect]).toString());

        assert.equal(adjacency.adjustments.horizontal.overlapped, true);
        assert.equal(adjacency.adjustments.horizontal.snapped, "AFTER");

        let expected = {
            "left": 20,
            "top": 10,
            "right": 30,
            "bottom": 20,
            "width": 10,
            "height": 10
        };

        assertJSON(adjacency.adjustedRect, expected );

    });

    it("Primary coming from the left, horizontal (snapping before)", function () {

        let primaryRect = Rects.createFromBasicRect({left: 14, top: 4, width: 10, height: 10, right: 24});

        let secondaryRect = Rects.createFromBasicRect({left: 18, top: 4, width: 10, height: 10, right: 28});

        console.log("BEFORE: " + RectArt.formatRects([secondaryRect, primaryRect]).toString());

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        // assert.equal(adjacency.adjustments.vertical.overlapped, false);
        // assert.equal(adjacency.adjustedRect.top, 4);

        console.log("AFTER: " + RectArt.formatRects([secondaryRect, adjacency.adjustedRect]).toString());

        assert.equal(adjacency.adjustments.horizontal.overlapped, true);
        assert.equal(adjacency.adjustments.horizontal.snapped, "BEFORE");

        let expected = {
            "left": 8,
            "top": 4,
            "right": 18,
            "bottom": 14,
            "width": 10,
            "height": 10
        };

        assertJSON(adjacency.adjustedRect, expected);

    });

    xit("No horizontal overlap", function () {

        let primaryRect = Rects.createFromBasicRect({left: 14, top: 4, width: 10, height: 10, right: 24});

        let secondaryRect = Rects.createFromBasicRect({left: 30, top: 4, width: 10, height: 10, right: 28});

        console.log("BEFORE: " + RectArt.formatRects([secondaryRect, primaryRect]).toString());

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        // assert.equal(adjacency.adjustments.vertical.overlapped, false);
        // assert.equal(adjacency.adjustedRect.top, 4);

        console.log("AFTER: " + RectArt.formatRects([secondaryRect, adjacency.adjustedRect]).toString());

        assert.equal(adjacency.adjustments.horizontal.overlapped, false);
        assert.equal(adjacency.adjustments.horizontal.snapped, null);

        assertJSON(adjacency.adjustedRect, primaryRect);

    });


    it("Primary coming from the bottom, vertical (snapping after)", function () {

        let primaryRect = Rects.createFromBasicRect({left: 10, top: 16, width: 10, height: 10});


        let secondaryRect = Rects.createFromBasicRect({left: 10, top: 10, width: 10, height: 10});

        console.log("BEFORE: " + RectArt.formatRects([secondaryRect, primaryRect]).toString());

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        console.log("AFTER: " + RectArt.formatRects([secondaryRect, adjacency.adjustedRect]).toString());

        assert.equal(adjacency.adjustment.overlapped, true);
        assert.equal(adjacency.adjustment.snapped, "AFTER");

        let expected = {
            "left": 10,
            "top": 20,
            "right": 20,
            "bottom": 30,
            "width": 10,
            "height": 10
        };

        assertJSON(adjacency.adjustedRect, expected );

    });


    xit("Large box coming from left", function () {

        let primaryRect = Rects.createFromBasicRect({
            "left": 219,
            "top": 128,
            "right": 419,
            "bottom": 328,
            "width": 200,
            "height": 200
        });

        let secondaryRect = Rects.createFromBasicRect({
            "left": 400,
            "top": 150,
            "right": 500,
            "bottom": 250,
            "width": 100,
            "height": 100
        });

        assert.equal(Rects.intersect(primaryRect, secondaryRect), true);

        // FIXME: this is a bug.. intersect says it's intersected but the
        // rect adjacency calculator says it is not...

        // FIXME: resizing doesn't work now...

        // FIXME: moving elements outside the parent is possible thanks to a bug
        // or lack of feature in the rect adjacency calculator..

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        assert.equal(adjacency.adjustment !== null, true);
        assert.equal(adjacency.adjustment.overlapped, true);
        assert.equal(adjacency.adjustment.snapped, "BEFORE");

        let expected = {
            "left": 200,
            "top": 128,
            "right": 400,
            "bottom": 328,
            "width": 200,
            "height": 200
        };

        assertJSON(adjacency.adjustedRect, expected );

    });


    //
    // intersectedPagemarks:  {
    //     "elementRect": {
    //         "left": 301,
    //             "top": 137,
    //             "right": 501,
    //             "bottom": 337,
    //             "width": 200,
    //             "height": 200
    //     },
    //     "intersectedRects": [
    //         {
    //             "left": 400,
    //             "top": 150,
    //             "right": 500,
    //             "bottom": 250,
    //             "width": 100,
    //             "height": 100
    //         }
    //     ]
    // }
    //

    // adjacency: {
    // {
    //     "primaryRect": {
    //     "left": 301,
    //         "top": 137,
    //         "right": 501,
    //         "bottom": 337,
    //         "width": 200,
    //         "height": 200
    // },
    //     "secondaryRect": {
    //     "left": 400,
    //         "top": 150,
    //         "right": 500,
    //         "bottom": 250,
    //         "width": 100,
    //         "height": 100
    // },
    //     "adjustments": {
    //     "horizontal": {
    //         "overlapped": false,
    //             "start": 301,
    //             "snapped": null,
    //             "axis": "x"
    //     },
    //     "vertical": {
    //         "overlapped": false,
    //             "start": 137,
    //             "snapped": null,
    //             "axis": "y"
    //     }
    // },
    //     "adjustment": null,
    //     "adjustedRect": null
    // }

});

