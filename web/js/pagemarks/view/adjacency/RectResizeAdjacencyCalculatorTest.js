
const assert = require('assert');
const {assertJSON} = require("../../../test/Assertions");

const {Rect} = require("../../../Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {RectArt} = require("../../../util/RectArt");

const {RectResizeAdjacencyCalculator} = require("./RectResizeAdjacencyCalculator");

describe('RectResizeAdjacencyCalculator', function() {

    it("Resize coming from right.", function () {

        let resizeRect = Rects.createFromBasicRect({left: 10, top: 0, width: 20, height: 20});
        let intersectedRect = Rects.createFromBasicRect({left: 5, top: 0, width: 10, height: 10});

        console.log("BEFORE: \n" + RectArt.formatRects([resizeRect, intersectedRect]).toString());

        let rectResizeAdjacencyCalculator = new RectResizeAdjacencyCalculator();
        let adjustedRect = rectResizeAdjacencyCalculator.calculate(resizeRect, intersectedRect);

        assert.notEqual(adjustedRect, null);

        assert.equal(resizeRect.right, adjustedRect.right);
        assert.equal(resizeRect.bottom, adjustedRect.bottom);
        assert.equal(resizeRect.top, adjustedRect.top);

        let expected = {
            "left": 15,
            "top": 0,
            "right": 30,
            "bottom": 20,
            "width": 15,
            "height": 20
        };

        assertJSON(adjustedRect, expected );

    });

});
