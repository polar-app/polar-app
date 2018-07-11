const {Preconditions} = require("../Preconditions");
const {Rects} = require("../Rects");
const {Interval} = require("../math/Interval");

const ENTIRE_PAGE = Rects.createFromBasicRect({
    left: 0,
    top: 0,
    width: 100,
    height: 100
});

/**
 * The box layout of this pagemark.  We use the typical DOM positioning style
 * of top, left, width and height only instead of percentages we represent
 * this as percentage of the entire 'page'.
 *
 * For example:
 *
 * This would represent the range within a page that a pagemark covers.  This is
 * essentially a range has a start and end which are percentages of the page that
 * a pagemark covers but in two dimensions (not just one).
 *
 * A default pagemark (for the entire page) would have a value of:
 *
 * { top: 0, left: 0, width: 100, height: 100 }
 *
 * A range for a page that is half way completed is [0,50]
 *
 * { top: 0, left: 0, width: 100, height: 50 }
 *
 * We also provide additional functionality where we can start the pagemark
 * other than at the top of the page. For example, if you wanted to mark the
 * bottom 50% of the page as read, you could create the pagemark as:
 *
 * { top: 50, left: 0, width: 100, height: 50 }
 *
 * The user can create pagemarks at any point and then we create a small
 * pagemark anchored to that spot, and give it a bit of height so that the user
 * can visually see it.
 *
 * Note that the percentage are of the available width and height.  The normal
 * ratio we use is 8.5x11 but width and height as percentages would be 100x100.
 *
 * This would NOT be a square but a rectangle and the percentages confuse that.
 *
 */
class PagemarkRect {

    constructor(obj) {

        /**
         * @type {number}
         */
        this.top = undefined;

        /**
         * @type {number}
         */
        this.left = undefined;

        /**
         * @type {number}
         */
        this.width = undefined;

        /**
         * @type {number}
         */
        this.height = undefined;

        Object.assign(this, obj);

        this._validate();

    }

    /**
     * Make sure we are in a valid state and that the intervals are within
     * proper values.
     *
     * @private
     */
    _validate() {

        let interval = new Interval(0,100);

        let assertInterval = (value) => interval.containsPoint(value);

        Preconditions.assert(this.top, assertInterval, "top");
        Preconditions.assert(this.left, assertInterval, "left");
        Preconditions.assert(this.width, assertInterval, "width");
        Preconditions.assert(this.height, assertInterval, "height");

    }

    /**
     * Compute a percentage of the page that this rect holds.
     */
    toPercentage() {
        return 100 * (Rects.createFromBasicRect(this).area / ENTIRE_PAGE.area);
    }

    /**
     * Convert this to a fractional rect where all the values are in the
     * interval [0.0,1.0]
     *
     * @return {Rect}
     */
    toFractionalRect() {

        let result = {};

        for(let key in this) {

            if(! this.hasOwnProperty(key))
                continue;

            result[key] = this[key] / 100;

        }

        return Rects.createFromBasicRect(result);

    }

};

module.exports.PagemarkRect = PagemarkRect;
