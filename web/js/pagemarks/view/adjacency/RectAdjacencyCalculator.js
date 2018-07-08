const {Rect} = require("../../../Rect")
const {Rects} = require("../../../Rects")
const {Line} = require("./Line");
const {Adjacency} = require("./Adjacency");
const {LineAdjustment} = require("./LineAdjustment");

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

        if(secondaryLine.overlaps(primaryLine) || primaryLine.overlaps(secondaryLine)) {

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

module.exports.RectAdjacencyCalculator = RectAdjacencyCalculator;
