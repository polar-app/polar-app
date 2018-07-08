const {Rects} = require("../../../Rects")

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

module.exports.LineAdjustment = LineAdjustment;
