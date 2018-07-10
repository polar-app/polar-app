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

        Preconditions.assertTypeof(this.left, "boolean");
        Preconditions.assertTypeof(this.top, "boolean");
        Preconditions.assertTypeof(this.right, "boolean");
        Preconditions.assertTypeof(this.bottom, "boolean");

    }

    toHorizontal() {
        return new LineEdges(this.left, this.right);
    }

    toVertical() {
        return new LineEdges(this.top, this.bottom);
    }

}
