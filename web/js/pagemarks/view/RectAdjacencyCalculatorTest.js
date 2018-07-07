
const assert = require('assert');
const {assertJSON} = require("../../test/Assertions");

const {Rect} = require("../../Rect");
const {Rects} = require("../../Rects");
const {Objects} = require("../../util/Objects");
const {RectArt} = require("../../util/RectArt");

const {RectAdjacencyCalculator} = require("./RectAdjacencyCalculator");

describe('RectAdjacencyCalculator', function() {

    // FIXME: test the snapping direction... do we snap before or after the primary

    it("Primary coming from the right (snapping after)", function () {

        let primaryRect = Rects.createFromBasicRect({left: 16, top: 10, width: 10, height: 10});

        let secondaryRect = Rects.createFromBasicRect({left: 10, top: 10, width: 10, height: 10});

        console.log("BEFORE: " + RectArt.formatRects([secondaryRect, primaryRect]).toString());

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        console.log("AFTER: " + RectArt.formatRects([secondaryRect, adjacency.adjustedRect]).toString());

        assert.equal(adjacency.intersected.horizontally, true);
        assert.equal(adjacency.snapped.x, "AFTER");

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

    it("Primary coming from the left (snapping before)", function () {

        let primaryRect = Rects.createFromBasicRect({left: 14, top: 4, width: 10, height: 10, right: 24});

        let secondaryRect = Rects.createFromBasicRect({left: 18, top: 4, width: 10, height: 10, right: 28});

        console.log("BEFORE: " + RectArt.formatRects([secondaryRect, primaryRect]).toString());

        let adjacency = RectAdjacencyCalculator.calculate(primaryRect, secondaryRect);

        console.log("AFTER: " + RectArt.formatRects([secondaryRect, adjacency.adjustedRect]).toString());

        assert.equal(adjacency.intersected.horizontally, true);
        assert.equal(adjacency.snapped.x, "BEFORE");

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

});
