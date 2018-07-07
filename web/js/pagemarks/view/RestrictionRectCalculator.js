const {Preconditions} = require("../../Preconditions");
const {Rect} = require("../../Rect");

class RestrictionRectCalculator {

    /**
     * @param parentRect {Rect}
     * @param siblingRects {Array<Rect>}
     * @param selfRect {Rect}
     */
    constructor(parentRect, siblingRects, selfRect) {

        // FIXME: we should have an input validation step that makes sure the
        // data we're given isn't an impossible position.  For example a 0x0
        // parentSibling holding huge boxes.

        this.parentRect = Preconditions.assertNotNull(parentRect, "parentRect");
        this.siblingRects = Preconditions.assertNotNull(siblingRects, "siblingRects");
        this.selfRect = Preconditions.assertNotNull(selfRect, "selfRect");

    }


    calculateField(selfKey, siblingKey, comparisonFunction, defaultValue) {

        // start off with ALL sibling Rects.
        let siblingRects = this.siblingRects;

        // now filter out the columns that are applicable.
        siblingRects = siblingRects.filter(siblingRect => comparisonFunction( siblingRect[siblingKey], this.selfRect[selfKey]));

        // now constrain those to only the ones we would collide with
        if(selfKey === "left" || selfKey === "right") {
            siblingRects = siblingRects.filter(siblingRect => this.verticalFilter(siblingRect, this.selfRect));
        }

        if(selfKey === "top" || selfKey === "bottom") {
            siblingRects = siblingRects.filter(siblingRect => this.horizontalFilter(siblingRect, this.selfRect));
        }

        return Math.max(defaultValue, siblingRects.map(siblingRect => siblingRect[siblingKey]));

    }


    /**
     *
     * @param line0 {Array<number>}
     * @param line1 {Array<number>}
     * @return {boolean}
     */
    lineIntersects(line0, line1) {
        return line0[0] < line1[1] && line0[1] > line1[0]
    }

    /**
     */
    verticalFilter(siblingRect, selfRect) {
        return this.lineIntersects([siblingRect.top, siblingRect.bottom], [selfRect.top, selfRect.bottom]);
    }

    horizontalFilter(siblingRect, selfRect) {
        return this.lineIntersects([siblingRect.left, siblingRect.right], [selfRect.left, selfRect.right]);
    }

    calculateLeft() {
        return this.calculateField("left", "right", lte, this.parentRect.left)

    }

    calculateRight() {
        return this.calculateField("right", "left", gte, this.parentRect.right)
    }

    calculateTop() {
        return this.calculateField("top", "bottom", lte, this.parentRect.top )
    }

    calculateBottom() {
        let result = this.calculateField("bottom", "top", gte, this.parentRect.bottom );
        return result;
    }

    /**
     *
     * @return {Rect} A rect representing the bounding area we are using.
     */
    calculate() {

        let result = {};

        result.left = this.calculateLeft();
        result.right = this.calculateRight();
        result.top = this.calculateTop();
        result.bottom = this.calculateBottom();

        // now just the width and height
        result.height = result.bottom - result.top;
        result.width = result.right - result.left;

        return new Rect(result);

    }

}

function gte(val0, val1) {
    return val0 >= val1;
}

function lte(val0, val1) {
    return val0 <= val1;
}


module.exports.RestrictionRectCalculator = RestrictionRectCalculator;
