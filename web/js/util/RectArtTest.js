
const assert = require('assert');
const {assertJSON} = require("../test/Assertions");

const {Rect} = require("../Rect");
const {Rects} = require("../Rects");

const {RectArt} = require("./RectArt");

describe('RectArt', function() {

    it("Basic rect", function () {

        let rect = Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 10,
            height: 10
        });

        assertJSON(RectArt.createFromRect(rect).toString(), "" );

    });

});
