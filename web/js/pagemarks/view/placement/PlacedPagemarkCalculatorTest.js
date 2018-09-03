"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagemarkRect_1 = require("../../../metadata/PagemarkRect");
const Pagemarks_1 = require("../../../metadata/Pagemarks");
const Rects_1 = require("../../../Rects");
const PlacedPagemarkCalculator_1 = require("./PlacedPagemarkCalculator");
const Assertions_1 = require("../../../test/Assertions");
describe('PlacedPagemarkCalculator', function () {
    describe('Placement', function () {
        it("50%", function () {
            let pagemarkRect = new PagemarkRect_1.PagemarkRect({
                top: 0,
                left: 0,
                width: 50,
                height: 50
            });
            let pagemark = Pagemarks_1.Pagemarks.create({ rect: pagemarkRect });
            let parentRect = Rects_1.Rects.createFromBasicRect({
                top: 0,
                left: 0,
                width: 800,
                height: 1000
            });
            let pagemarkPlacementCalculator = new PlacedPagemarkCalculator_1.PlacedPagemarkCalculator();
            let placedPagemark = pagemarkPlacementCalculator.calculate(parentRect, pagemark);
            let expected = {
                "rect": {
                    "left": 0,
                    "top": 0,
                    "right": 400,
                    "bottom": 500,
                    "width": 400,
                    "height": 500
                }
            };
            Assertions_1.assertJSON(placedPagemark, expected);
        });
    });
});
//# sourceMappingURL=PlacedPagemarkCalculatorTest.js.map