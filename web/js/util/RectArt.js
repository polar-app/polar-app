const {TextArray} = require("./TextArray");

/**
 * Draw ascii art rects for visualization.
 */
class RectArt {

    constructor(width, height) {

        this.textArray = new TextArray(width, height);

    }

    drawHorizontalLine(xOrigin, yAxis, width) {

        for(let idx = 0; idx < width; ++idx) {
            this.textArray.write(xOrigin + idx, yAxis, "-");
        }

    }

    drawVerticalLine(xAxis, yOrigin, height) {

        for(let idx = 0; idx < height; ++idx) {
            this.textArray.write(xAxis, yOrigin + idx, "|");
        }

    }

    write(x, y, val) {
        this.textArray.write(x,y,val);
    }

    toString() {
        return this.textArray.toString();
    }

    /**
     *
     * @param rect {Rect}
     * @return {RectArt}
     */
    static createFromRect(rect) {

        let rectArt = new RectArt(rect.left + rect.width, rect.top + rect.height);

        rectArt.drawHorizontalLine(rect.left, rect.top, rect.width);
        rectArt.drawHorizontalLine(rect.left, rect.bottom - 1, rect.width);

        rectArt.drawVerticalLine(rect.left, rect.top, rect.height);
        rectArt.drawVerticalLine(rect.right, rect.top, rect.height);

        rectArt.write(rect.left, rect.top, "+");
        rectArt.write(rect.left, rect.bottom - 1, "+");
        rectArt.write(rect.right, rect.top, "+");
        rectArt.write(rect.right, rect.bottom -1, "+");

        return rectArt;

    }

}

module.exports.RectArt = RectArt;


