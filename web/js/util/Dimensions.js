const {Preconditions} = require("../Preconditions");
/**
 * Simple dimension of a Rect.
 */
class Dimensions {

    constructor(obj) {

        /**
         * This width of this rect.
         *
         * @type {number}
         */
        this.width = undefined;

        /**
         * This height of this rect.
         *
         * @type {number}
         */
        this.height = undefined;

        Object.assign(this, obj);

        Preconditions.assertNumber(this.height, "height");
        Preconditions.assertNumber(this.width, "width");

    }

    get area() {
        return this.width * this.height;
    }

    toString() {
        return `${this.width}x${this.height}`;
    }

}

module.exports.Dimensions = Dimensions;
