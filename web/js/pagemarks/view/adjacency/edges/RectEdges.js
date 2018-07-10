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

        Preconditions.assertTypeof(this.left, "left", "boolean");
        Preconditions.assertTypeof(this.top, "top", "boolean");
        Preconditions.assertTypeof(this.right, "right", "boolean");
        Preconditions.assertTypeof(this.bottom, "bottom", "boolean");

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
