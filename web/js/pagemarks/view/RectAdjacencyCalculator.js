const {Rect} = require("../../Rect")
const {Rects} = require("../../Rects")

class AdjacentRect {

    constructor() {

        /**
         * @type {boolean}
         */
        this.intersectedHorizontally = false;

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
 * @param min {number}
 * @param pt {number}
 * @param max {number}
 */
function interval(min, pt, max) {
    return pt >= min && pt <= max;
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

        result.intersectedHorizontally
            = interval(secondary.left, primary.left, secondary.right) ||
              interval(secondary.left, primary.right, secondary.right);

        // TODO: based on whichever it is closest to, we can decide which side
        // to adjust..  This would be a better strategy I think.

        // primary coming from the left
        // *** secondary.left <= primary.left <= secondary.right
        if(result.intersectedHorizontally) {

            // FIXME: when migrating to a line model, call these start + end

            // TODO: how which side to do we need to dock to?

            let delta = secondary.right - primary.left;

            // determine the percentage we are within the secondary. If we're >
            // 0.5 we should jump to the right.  Otherwise, jump to the left.
            let perc = delta / secondary.height;

            console.log("FIXME: perc: " + perc);

            if(perc < 0.5) {
                result.adjustedRect = Rects.move(primary, {x: secondary.right}, true);
                result.snapped.x = "AFTER";
            } else {
                result.adjustedRect = Rects.move(primary, {x: secondary.left - primary.width}, true);
                result.snapped.x = "BEFORE";
            }

            // // now determine which side to adjust to...
            //
            // result.adjustedRect = Rects.move(primary, {x: delta, y: 0});

        }

        // *** primary coming from the right

        // *** secondary.right <= primary.right <= secondary.left
        // if(secondary.right <= primary.right && primary.right <= secondary.left) {
        //     let delta = secondary.left - primary.right;
        //     primary = Rects.move(primary, {x: delta, y: 0});
        // }

        return result;

    }


}

module.exports.RectAdjacencyCalculator = RectAdjacencyCalculator;
