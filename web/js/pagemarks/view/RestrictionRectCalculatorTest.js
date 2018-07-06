var assert = require('assert');
const {assertJSON} = require("../../test/Assertions");

const {Rect} = require("../../Rect");
const {Rects} = require("../../Rects");

const {RestrictionRectCalculator, BoundingRect} = require("./RestrictionRectCalculator");

describe('RestrictionRectCalculator', function() {

    // https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object

    describe('BoundingRect', function() {

        it("Basic calculation", function () {

            let parentRect = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 500, height: 300}));

            let siblingRect0 = Rects.createFromBasicRect(new Rect({left: 10, top: 10, width: 100, height: 100}));

            let selfRect = Rects.createFromBasicRect(new Rect({left: 200, top: 10, width: 100, height: 100}));

            let boundingRect = new BoundingRect(parentRect, [siblingRect0], selfRect);

            assert.equal(boundingRect.calculateLeft(), 110);

        });

    });

});
