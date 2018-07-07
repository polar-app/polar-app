
const assert = require('assert');
const {assertJSON} = require("../../test/Assertions");

const {Rect} = require("../../Rect");
const {Rects} = require("../../Rects");
const {Objects} = require("../../util/Objects");

const {RectAdjacencyCalculator} = require("./RectAdjacencyCalculator");

describe('RectAdjacencyCalculator', function() {

    it("Left", function () {

        let primaryRect = Rects.createFromBasicRect({left: 100, top: 10, width: 100, height: 100});

        let secondaryRect = Rects.createFromBasicRect({left: 10, top: 10, width: 100, height: 100});

        assertJSON(RectAdjacencyCalculator.calculate(primaryRect, secondaryRect), {
            "left": 110,
            "top": 10,
            "right": 210,
            "bottom": 110,
            "width": 100,
            "height": 100
        } );

    });

    it("Right", function () {

        let primaryRect = Rects.createFromBasicRect({left: 10, top: 10, width: 100, height: 100});

        let secondaryRect = Rects.createFromBasicRect({left: 100, top: 10, width: 100, height: 100});

        assertJSON(RectAdjacencyCalculator.calculate(primaryRect, secondaryRect), {
            "left": 110,
            "top": 10,
            "right": 210,
            "bottom": 110,
            "width": 100,
            "height": 100
        } );

    });

});
