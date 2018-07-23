const {Line} = require("./util/Line");
const {Dimensions} = require("./util/Dimensions");
const {Preconditions} = require("./Preconditions");

/**
 * Basic DOM style rect without a hard requirement to use a DOMRect.
 */
class Rect {

    // TODO: some rects have x,y as well as left,top ... should we add them here
    // to be complete and closer to a DOMRect?

    constructor(obj) {

        /**
         * @type {number}
         */
        this.left = undefined;

        /**
         * @type {number}
         */
        this.top = undefined;

        /**
         * @type {number}
         */
        this.right = undefined;

        /**
         * @type {number}
         */
        this.bottom = undefined;

        /**
         * @type {number}
         */
        this.width = undefined;

        /**
         * @type {number}
         */
        this.height = undefined;

        Object.assign(this, obj);

    }

    /**
     *
     * @param axis {String} The axis to use (x or y)
     * @return {Line}
     */
    toLine(axis) {

        if(axis === "x") {
            return new Line(this.left, this.right, axis);
        } else if(axis === "y") {
            return new Line(this.top, this.bottom, axis);
        } else {
            throw new Error("Wrong axis: " + axis);
        }

    }

    /**
     *
     * @return {Dimensions}
     */
    get dimensions() {
        return new Dimensions({
            width: this.width,
            height: this.height
        });
    }

    get area() {
        return this.width * this.height;
    }

    /**
     * Adjust an axis based on the given line.
     *
     * @param line {Line} The line representing the axis.
     * @return {Rect} Return a NEW rect with updated dimensions.
     */
    adjustAxis(line) {

        Preconditions.assertNotNull(line, "line");
        Preconditions.assertNotNull(line.axis, "line.axis");

        let result = new Rect(this);

        if(line.axis === "x") {

            result.left = line.start;
            result.right = line.end;
            result.width = line.end - line.start;

        } else if(line.axis === "y") {

            result.top = line.start;
            result.bottom = line.end;
            result.height = line.end - line.start;

        } else {
            throw new Error("Invalid axis: " + line.axis);
        }

        return result;

    }

}

module.exports.Rect = Rect;
