const {Preconditions} = require("../../Preconditions");

class BoundingRect {

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

        this.left = 0;

        this.top = 0;

        this.right = Infinity;

        this.bottom = Infinity;

    }

    /**
     * @return {number}
     */
    calculateLeft0() {

        let defaultValue = 0;
        return Math.max(defaultValue, this.siblingRects.filter(siblingRect => siblingRect.right <= this.selfRect.left)
                                                       .map(siblingRect => siblingRect.right));
    }

    calculateField(selfKey, siblingKey, comparisonFunction, defaultValue) {

        return Math.max(defaultValue, this.siblingRects.filter(siblingRect => comparisonFunction( siblingRect[siblingKey], this.selfRect[selfKey]))
                                                       .map(siblingRect => siblingRect[siblingKey]));

    }

    calculateLeft() {

        return this.calculateField("left", "right", lte, 0 )

        // let defaultValue = 0;
        // return Math.max(defaultValue, this.siblingRects.filter(siblingRect => siblingRect.right <= this.selfRect.left)
        //                                   .map(siblingRect => siblingRect.right));
    }


    /**
     * @return {number}
     */
    calculateRight0() {

        let defaultValue = Infinity;
        return Math.max(defaultValue, this.siblingRects.filter(siblingRect => siblingRect.left >= this.selfRect.right)
                                                       .map(siblingRect => siblingRect.left));
    }

    calculateRight() {
        return this.calculateField("right", "left", gte, Infinity )
    }


    calculate() {
        this.left = this.calculateLeft();
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


function gte(val0, val1) {
    return val0 >= val1;
}

function lte(val0, val1) {
    return val0 <= val1;
}


module.exports.BoundingRect = BoundingRect;
module.exports.RestrictionRectCalculator = RestrictionRectCalculator;
