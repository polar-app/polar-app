const {Preconditions} = require("../../Preconditions");
const {Rect} = require("../../Rect");

/**
 * The default max value for calculation functions.  JSON doesn't support
 * infinity which is actually more appropriate but this value is actually never
 * used in practice. It just needs to be some large upper bound that's
 * immediately discarded in favor of the parent box.  We're just selecting a
 * VERY large number which would be impossible for a real world usable browser
 * to display.
 *
 * @type {number}
 */
const DEFAULT_MAX = 1000000000;

class BoundingRectCalculator {

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
            console.log("FIXME: siblingRects are now: ", JSON.stringify(siblingRects, null, "  "));
            siblingRects = siblingRects.filter(siblingRect => this.verticalFilter(siblingRect, this.selfRect));
            console.log("FIXME: siblingRects are now: AFTER", JSON.stringify(siblingRects, null, "  "));
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

        // console.log("FIXME: siblingRect: " + JSON.stringify(siblingRect, null, "  "));
        // console.log("FIXME: selfRect: " + JSON.stringify(selfRect, null, "  "));
        //
        // let predicate0 = gte(siblingRect.bottom, selfRect.top);
        // let predicate1 = lte(siblingRect.top, selfRect.bottom);
        //
        // console.log("FIXME: predicate0: " + predicate0);
        // console.log("FIXME: predicate1: " + predicate1);
        //
        // return or(predicate0, predicate1);
    }

    horizontalFilter(siblingRect, selfRect) {

        // FIXME this horizontal filter is actually easy...

        let height = Math.min(siblingRect.top, selfRect.top) - Math.max(siblingRect.bottom - selfRect.bottom);

        return () => {
            return or(lte(siblingRect.right, selfRect.left), gte(siblingRect.left, selfRect.right));
        }


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

class RestrictionRectCalculator {

    /**
     * Compute a smaller rect within the parent rect which prevents us
     * overlapping with other sibling rects within the parent.
     *
     * @param parentRect {Rect}
     * @param siblingRects {Array<Rect>}
     */
    static calculate(parentRect, siblingRects) {

        let boundingRect = {
            left: 0,
            top: 0,
            right: Infinity,
            bottom: Infinity
        };


    }

}

function or(predicate0, predicate1) {
    return predicate0 || predicate1;
}

function gte(val0, val1) {
    return val0 >= val1;
}

function lte(val0, val1) {
    return val0 <= val1;
}


module.exports.BoundingRect = BoundingRectCalculator;
module.exports.RestrictionRectCalculator = RestrictionRectCalculator;
