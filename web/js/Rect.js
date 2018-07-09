const {Line} = require("./util/Line");

/**
 * Basic DOM style rect without a hard requirement to use a DOMRect.
 */
class Rect {

    // TODO: some rects have x,y ... should we add them here to be complete?

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
     * @return {Line}
     */
    horizontalLine() {
        return new Line(this.left, this.right);
    }

    /**
     *
     * @return {Line}
     */
    verticalLine() {
        return new Line(this.top, this.bottom);
    }

    /**
     * Adjust the horizontal based on the given line.
     * @param line {Line}
     */
    adjustHorizontal(line) {
        this.left = line.start;
        this.right = line.end;
        this.width = this.right - this.left;
    }

    /**
     * Adjust the vertical based on the given line.
     * @param line {Line}
     */
    adjustVertical(line) {
        this.top = line.start;
        this.bottom = line.end;
        this.height = this.bottom - this.top;
    }

}

module.exports.Rect = Rect;
