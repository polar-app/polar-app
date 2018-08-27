"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextArray_1 = require("./TextArray");
class RectArt {
    constructor(width, height) {
        this.textArray = new TextArray_1.TextArray(width + 1, height + 1);
        this.width = width;
        this.height = height;
    }
    drawHorizontalLine(xOrigin, yAxis, width) {
        for (let idx = 0; idx < width; ++idx) {
            this.textArray.write(xOrigin + idx, yAxis, "-");
        }
    }
    drawVerticalLine(xAxis, yOrigin, height) {
        for (let idx = 0; idx < height; ++idx) {
            this.textArray.write(xAxis, yOrigin + idx, "|");
        }
    }
    write(x, y, val) {
        this.textArray.write(x, y, val);
    }
    toTextArray() {
        return this.textArray;
    }
    toString() {
        return this.textArray.toString();
    }
    static createFromRect(rect) {
        let rectArt = new RectArt(rect.left + rect.width, rect.top + rect.height);
        rectArt.drawHorizontalLine(rect.left, rect.top, rect.width);
        rectArt.drawHorizontalLine(rect.left, rect.bottom - 1, rect.width);
        rectArt.drawVerticalLine(rect.left, rect.top, rect.height);
        rectArt.drawVerticalLine(rect.right, rect.top, rect.height);
        rectArt.write(rect.left, rect.top, "+");
        rectArt.write(rect.left, rect.bottom - 1, "+");
        rectArt.write(rect.right, rect.top, "+");
        rectArt.write(rect.right, rect.bottom - 1, "+");
        return rectArt;
    }
    static formatRects(rects) {
        let rectArts = rects.map(RectArt.createFromRect);
        let rectTextArrays = rectArts.map(current => current.toTextArray());
        let width = Math.max(...rectTextArrays.map(current => current.width));
        let height = Math.max(...rectTextArrays.map(current => current.height));
        let target = new TextArray_1.TextArray(width, height);
        rectArts.forEach(current => {
            target.merge(current.toTextArray());
        });
        return target;
    }
}
exports.RectArt = RectArt;
//# sourceMappingURL=RectArt.js.map