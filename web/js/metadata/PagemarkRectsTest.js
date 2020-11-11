"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const PagemarkRects_1 = require("./PagemarkRects");
const Rects_1 = require("../Rects");
describe('PagemarkRects', function () {
    describe('createFromPositionedRect', function () {
        it("basic", function () {
            let rect = Rects_1.Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: 800,
                height: 500
            });
            let parentRect = Rects_1.Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: 800,
                height: 1000
            });
            let expected = {
                "left": 0,
                "top": 0,
                "width": 100,
                "height": 50
            };
            Assertions_1.assertJSON(PagemarkRects_1.PagemarkRects.createFromPositionedRect(rect, parentRect), expected);
        });
    });
});
//# sourceMappingURL=PagemarkRectsTest.js.map