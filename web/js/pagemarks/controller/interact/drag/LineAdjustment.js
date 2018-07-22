const {Rects} = require("../../../../Rects")
const {Preconditions} = require("../../../../Preconditions")
const {Objects} = require("../../../../util/Objects")

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
         * The previous point on the line.
         *
         * @type {number}
         */
        this.previous = undefined;

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
     *
     * @return {Rect}
     */
    adjustRect(primaryRect) {

        let dir = {};
        dir[this.axis] = this.start;

        let absolute=true;

        return Rects.move(primaryRect, dir, absolute);

    }

    static create(opts) {

        Preconditions.assertNotNull(opts.start, "start");
        Preconditions.assertNotNull(opts.previous, "previous");
        Preconditions.assertNotNull(opts.snapped, "snapped");
        Preconditions.assertNotNull(opts.axis, "axis");

        opts = Objects.duplicate(opts);
        opts.overlapped = true;
        opts.delta = Math.abs(opts.previous - opts.start);

        return new LineAdjustment(opts);

    }

}

module.exports.LineAdjustment = LineAdjustment;
