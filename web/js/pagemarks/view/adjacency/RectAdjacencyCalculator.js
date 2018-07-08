const {Rect} = require("../../../Rect")
const {Rects} = require("../../../Rects")

class Adjacency {

    constructor() {

        /**
         *
         * @type {Rect}
         */
        this.primaryRect = undefined;

        /**
         *
         * @type {Rect}
         */
        this.secondaryRect = undefined;

        this.adjustments = {

            /**
             * @type {LineAdjustment}
             */
            horizontal: null,

            /**
             * @type {LineAdjustment}
             */
            vertical: null

        };

        /**
         *
         * The final adjustment.
         *
         * @type {LineAdjustment}
         */
        this.adjustment = null;

        /**
         * @type {Rect}
         */
        this.adjustedRect = null;

    }

}


class LineAdjustment {

    /**
     *
     */
    constructor(obj) {

        /**
         *
         * @type {boolean}
         */
        this.overlapped = undefined;

        /**
         *
         * @type {number}
         */
        this.start = undefined;

        /**
         * Whether we snapped before or after the intersection.
         *
         * @type {string}
         */
        this.snapped = undefined;

        /**
         * The proposed change for this line.
         *
         * @type {number}
         */
        this.delta = undefined;

        /**
         * The cartesian axis this line represents.  Either "x" or "y".
         *
         * This is used to adjust the rect when complete.
         *
         * @type {string}
         */
        this.axis = undefined;

        Object.assign(this, obj)

    }

    /**
     * Apply the adjustment to the given rect and return the new rect.
     */
    adjustRect(primaryRect) {

        let dir = {};
        dir[this.axis] = this.start;

        return Rects.move(primaryRect, dir, true);

    }

}

/**
 * If we have two rects, and the've moved to intersect, compute updated
 * positions so that they are ADJACENT, not intersecting.
 */
class RectAdjacencyCalculator {

    /**
     *
     * @param primaryRect {Rect} The primary rect that is moving and is intersecting with
     * the secondary rect.  The primary rect is the one we want to adjust.
     *
     * @param secondaryRect {Rect} The stationary rect that we need to keep our rect
     * adjacent too.
     *
     * @return {Adjacency} Return the new / correct position of the primary rect.
     */
    static calculate(primaryRect, secondaryRect) {

        let result = new Adjacency();

        result.primaryRect = Rects.validate(primaryRect);
        result.secondaryRect = Rects.validate(secondaryRect);

        let secondaryBox = {
            horizontal: new Line(secondaryRect.left, secondaryRect.right),
            vertical: new Line(secondaryRect.top, secondaryRect.bottom)
        };

        let primaryBox = {
            horizontal: new Line(primaryRect.left, primaryRect.right),
            vertical: new Line(primaryRect.top, primaryRect.bottom)
        };

        result.adjustments.horizontal
            = RectAdjacencyCalculator.adjust(primaryBox.horizontal, secondaryBox.horizontal, "x");

        result.adjustments.vertical
            = RectAdjacencyCalculator.adjust(primaryBox.vertical, secondaryBox.vertical, "y");

        let successfulAdjustments = [result.adjustments.horizontal, result.adjustments.vertical];

        // we only want to factor in where we actually overlapped.
        successfulAdjustments = successfulAdjustments.filter(current => current.overlapped === true);

        // now sort the adjustments so that ones with a lower delta are first.
        successfulAdjustments = successfulAdjustments.sort((adj0, adj1) => adj0.delta - adj1.delta);

        if(successfulAdjustments.length === 2) {

            // we are only valid if BOTH dimensions intersect (horizontal and
            // vertical)

            result.adjustment = successfulAdjustments[0];
            result.adjustedRect = result.adjustment.adjustRect(primaryRect);

        }

        return result;

    }

    /**
     * Adjust the line and return the required adjustment, or null if no adjustment
     * is needed.
     *
     * @param primaryLine {Line}
     * @param secondaryLine {Line}
     * @param axis {string} The axis this represents. "x" or "y".
     * @return {LineAdjustment}
     */
    static adjust(primaryLine, secondaryLine, axis) {

        let result = new LineAdjustment({
            axis
        });

        if(secondaryLine.overlaps(primaryLine)) {

            let gap = secondaryLine.end - primaryLine.start;

            // determine the percentage we are within the secondary. If we're >
            // 0.5 we should jump to the right.  Otherwise, jump to the left.
            let perc = gap / secondaryLine.width;

            result.overlapped = true;

            if(perc < 0.5) {
                result.start = secondaryLine.end;
                result.snapped = "AFTER";
            } else {
                result.start = secondaryLine.start - primaryLine.width;
                result.snapped = "BEFORE";
            }

            result.delta = Math.abs(primaryLine.start - result.start);

            return result;

        }

        result.overlapped = false;
        result.start = primaryLine.start;
        result.snapped = null;
        return result;

    }

}

/**
 * Simple line with just a start and end.
 */
class Line {

    /**
     *
     * @param start {number}
     * @param end {number}
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    /**
     * The width of the line. Not to be confused with the width of a rect.
     *
     * @return {number}
     */
    get width() {
        return this.end - this.start;
    }

    /**
     * Return true if the given point is between the start and end position
     * of the line (inclusive)
     *
     * @param pt {number}
     * @return {boolean}
     */
    containsPoint(pt) {
        return pt >= this.start && pt <= this.end;
    }

    /**
     * Return true if the given line overlaps the current line.  IE either the start
     * or end point on the given line is between the start and end points of the
     * current line.
     *
     * @param line {Line}
     * @return {boolean}
     */
    overlaps(line) {
        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }

    toString() {
        return `{start: ${this.start}, end: ${this.end}}`;
    }

}

module.exports.RectAdjacencyCalculator = RectAdjacencyCalculator;
