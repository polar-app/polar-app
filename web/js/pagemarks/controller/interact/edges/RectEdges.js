const {Preconditions} = require("../../../../Preconditions");
const {LineEdges} = require("./LineEdges");

/**
 * Stores how we are resizing a rect.  If any of the values are defined that
 * means this side is being resized. At most TWO can be resized at once.
 */
class RectEdges {

    constructor(obj) {

        /**
         * @type {boolean}
         */
        this.left = undefined;

        /**
         * @type {boolean}
         */
        this.top = undefined;

        /**
         * @type {boolean}
         */
        this.right = undefined;

        /**
         * @type {boolean}
         */
        this.bottom = undefined;

        Object.assign(this, obj);

        //  make sure we have all the values.

        Preconditions.assertTypeOf(this.left, "boolean", "left");
        Preconditions.assertTypeOf(this.top, "boolean", "top");
        Preconditions.assertTypeOf(this.right, "boolean", "right");
        Preconditions.assertTypeOf(this.bottom, "boolean", "bottom");

    }

    toLineEdges(axis) {
        if(axis === "x") {
            return new LineEdges({start: this.left, end: this.right});
        } else if (axis === "y") {
            return new LineEdges({start: this.top, end: this.bottom});
        } else {
            throw new Error("Unknown axis: " + axis);
        }
    }

}

module.exports.RectEdges = RectEdges;
