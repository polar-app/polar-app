
const assert = require('assert');
const {assertJSON} = require("../test/Assertions");

const {Rect} = require("../Rect");
const {Rects} = require("../Rects");

const {RectArt} = require("./RectArt");
const {TextArray} = require("./TextArray");


describe('RectArt', function() {

    it("Basic rect", function () {

        let rect = Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 10,
            height: 10
        });

        let expected = "                \n" +
                       "                \n" +
                       "                \n" +
                       "                \n" +
                       "                \n" +
                       "     +---------+\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     |         |\n" +
                       "     +---------+\n" +
                       "                \n" +
                       "                \n";
        assertJSON(RectArt.createFromRect(rect).toString(), expected );

    });

    it("Test merging two", function () {

        let rect0 = Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 10,
            height: 10
        });

        let rect1 = Rects.createFromBasicRect({
            left: 10,
            top: 10,
            width: 20,
            height: 20
        });

        let expected = "                               \n" +
                       "                               \n" +
                       "                               \n" +
                       "                               \n" +
                       "                               \n" +
                       "     +---------+               \n" +
                       "     |         |               \n" +
                       "     |         |               \n" +
                       "     |         |               \n" +
                       "     |         |               \n" +
                       "     |    +-------------------+\n" +
                       "     |    |    |              |\n" +
                       "     |    |    |              |\n" +
                       "     |    |    |              |\n" +
                       "     +----|----+              |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          |                   |\n" +
                       "          +-------------------+\n" +
                       "                               \n" +
                       "                               \n";

        let textArray = RectArt.formatRects([rect0, rect1]);

        //assert.equal(textArray.width, 15);
        assertJSON(textArray.toString(), expected );

    });


});

