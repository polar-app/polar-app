"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const Rects_1 = require("../Rects");
const RectArt_1 = require("./RectArt");
describe('RectArt', function () {
    it("Basic rect", function () {
        let rect = Rects_1.Rects.createFromBasicRect({
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
            "                \n";
        Assertions_1.assertJSON(RectArt_1.RectArt.createFromRect(rect).toString(), expected);
    });
    it("Test merging two", function () {
        let rect0 = Rects_1.Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 10,
            height: 10
        });
        let rect1 = Rects_1.Rects.createFromBasicRect({
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
            "                               \n";
        let textArray = RectArt_1.RectArt.formatRects([rect0, rect1]);
        Assertions_1.assertJSON(textArray.toString(), expected);
    });
});
//# sourceMappingURL=RectArtTest.js.map