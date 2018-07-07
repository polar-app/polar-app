const {Rect} = require("../../Rect")
const {Rects} = require("../../Rects")

class AdjacentRect {

    constructor() {

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
         * @type {Rect}
         */
        this.adjustedRect = null;

        /**
         * Whether we snapped before or after and on which axis.
         *
         * @type {Object}
         */
        this.snapped = {
            x: null,
            y: null,
        }

    }

}


/**
 * If we have two rects, and the've moved to intersect, compute updated
 * positions so that they are ADJACENT, not intersecting.
 */
class RectAdjacencyCalculator {

    /**
     *
     * @param primary {Rect} The primary rect that is moving and is intersecting with
     * the secondary rect.  The primary rect is the one we want to adjust.
     *
     * @param secondary {Rect} The stationary rect that we need to keep our rect
     * adjacent too.
     *
     * @return {AdjacentRect} Return the new / correct position of the primary rect.
     */
    static calculate(primary, secondary) {

        let result = new AdjacentRect();

        let secondaryBox = {
            horizontal: new Line(secondary.left, secondary.right),
            vertical: new Line(secondary.top, secondary.bottom)
        };

        let primaryBox = {
            horizontal: new Line(primary.left, primary.right),
            vertical: new Line(primary.top, primary.bottom)
        };

        result.adjustments.horizontal
            = RectAdjacencyCalculator.adjust(primaryBox.horizontal, secondaryBox.horizontal);

// /*
//         result.adjustments.vertical
//             = RectAdjacencyCalculator.adjust(primaryBox.vertical, secondaryBox.vertical);
// */

         result.adjustedRect = Rects.move(primary, {
                 x: result.adjustments.horizontal.start,
                 // y: result.adjustments.vertical.start
             },
             true);

        //
        // // TODO: make intersected an object with a horizontal property.
        // result.intersected.horizontally = secondaryBox.horizontal.overlaps(primaryBox.horizontal);
        // result.intersected.vertically = secondaryBox.vertical.overlaps(primaryBox.horizontal);
        //
        //     // = interval(secondary.left, primary.left, secondary.right) ||
        //     //   interval(secondary.left, primary.right, secondary.right);
        //
        // // TODO: based on whichever it is closest to, we can decide which side
        // // to adjust..  This would be a better strategy I think.
        //
        // // primary coming from the left
        // // *** secondary.left <= primary.left <= secondary.right
        // if(result.intersected.horizontally) {
        //
        //     // FIXME: when migrating to a line model, call these start + end
        //
        //     // TODO: how which side to do we need to dock to?
        //
        //     let delta = secondaryBox.horizontal.end - primaryBox.horizontal.start;
        //
        //     // determine the percentage we are within the secondary. If we're >
        //     // 0.5 we should jump to the right.  Otherwise, jump to the left.
        //     let perc = delta / secondaryBox.horizontal.width;
        //
        //     if(perc < 0.5) {
        //         result.adjustedRect = Rects.move(primary, {x: secondaryBox.horizontal.end}, true);
        //         result.snapped.x = "AFTER";
        //     } else {
        //         result.adjustedRect = Rects.move(primary, {x: secondaryBox.horizontal.start - primaryBox.horizontal.width}, true);
        //         result.snapped.x = "BEFORE";
        //     }
        //
        // }

        // *** primary coming from the right

        // *** secondary.right <= primary.right <= secondary.left
        // if(secondary.right <= primary.right && primary.right <= secondary.left) {
        //     let delta = secondary.left - primary.right;
        //     primary = Rects.move(primary, {x: delta, y: 0});
        // }

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

        console.log("FIXME: primaryLine: " + primaryLine)
        console.log("FIXME: secondaryLine: " + secondaryLine)

        if(secondaryLine.overlaps(primaryLine)) {

            let delta = secondaryLine.end - primaryLine.start;

            // determine the percentage we are within the secondary. If we're >
            // 0.5 we should jump to the right.  Otherwise, jump to the left.
            let perc = delta / secondaryLine.width;

            if(perc < 0.5) {

                return new LineAdjustment({
                    overlapped: true,
                    start: secondaryLine.end,
                    snapped: "AFTER"
                });

            } else {

                return new LineAdjustment({
                    overlapped: true,
                    start: secondaryLine.start - primaryLine.width,
                    snapped: "BEFORE"
                });

            }

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
         *
         * @type {string}
         */
        this.snapped = undefined;

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
