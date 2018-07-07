const {Rect} = require("../../Rect")
const {Rects} = require("../../Rects")

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
     * @return {Rect} Return the new / correct position of the primary rect.
     */
    static calculate(primary, secondary) {

        // *** secondary.left <= primary.left <= secondary.right
        if(secondary.left <= primary.left && primary.left <= secondary.right) {
            let delta = secondary.right - primary.left;
            primary = Rects.move(primary, {x: delta, y: 0});
        }

        // *** secondary.left <= primary.right <= secondary.right
        if(secondary.right <= primary.right && primary.right <= secondary.left) {
            let delta = secondary.left - primary.right;
            primary = Rects.move(primary, {x: delta, y: 0});
        }

        return primary;

    }

}

module.exports.RectAdjacencyCalculator = RectAdjacencyCalculator;
