const {Rect} = require("../../Rect")
const {Rects} = require("../../Rects")

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

        // FIXME: we don't handle when the rects SWALLOW one of them...

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
            = RectAdjacencyCalculator.adjust(primaryBox.horizontal, secondaryBox.horizontal);

        result.adjustments.vertical
            = RectAdjacencyCalculator.adjust(primaryBox.vertical, secondaryBox.vertical);

        // TODO: this code could be cleaned up by making a box out of lines and
        // just adjusting the line manually and building a new rect.

        if(result.adjustments.horizontal.delta < result.adjustments.vertical.delta) {

            result.adjustment = result.adjustments.horizontal;

            result.adjustedRect = Rects.move(primaryRect, {
                x: result.adjustments.horizontal.start,
            }, true);

        } else {

            result.adjustment = result.adjustments.vertical;

            result.adjustedRect = Rects.move(primaryRect, {
                y: result.adjustments.vertical.start
            }, true);

        }


        return result;

    }

    /**
     * Adjust the line and return the required adjustment, or null if no adjustment
     * is needed.
     *
     * @param primaryLine {Line}
     * @param secondaryLine {Line}
     * @return {LineAdjustment}
     */
    static adjust(primaryLine, secondaryLine) {

        if(secondaryLine.overlaps(primaryLine)) {

            let gap = secondaryLine.end - primaryLine.start;

            // determine the percentage we are within the secondary. If we're >
            // 0.5 we should jump to the right.  Otherwise, jump to the left.
            let perc = gap / secondaryLine.width;

            let result = new LineAdjustment({
                overlapped: true,
            });

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

        return new LineAdjustment({
            overlapped: false,
            start: primaryLine.start,
            snapped: null
        });

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

        Object.assign(this, obj)

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
