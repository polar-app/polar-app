"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRect = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Interval_1 = require("../math/Interval");
const Rects_1 = require("../Rects");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const ENTIRE_PAGE = Rects_1.Rects.createFromBasicRect({ left: 0, top: 0, width: 100, height: 100 });
class AnnotationRect {
    constructor(obj) {
        function round(value) {
            if (value > 100 && value < 100.1) {
                return 100;
            }
            return value;
        }
        this.left = obj.left;
        this.top = obj.top;
        this.width = round(obj.width);
        this.height = round(obj.height);
        this._validate();
    }
    _validate() {
        const interval = new Interval_1.Interval(0, 100);
        const assertInterval = (value) => {
            if (!interval.containsPoint(value)) {
                throw new Error(`Interval [${interval.line.start}, ${interval.line.end}] does not contain point: ${value}`);
            }
            return true;
        };
        Preconditions_1.Preconditions.assert(this.top, assertInterval, "top");
        Preconditions_1.Preconditions.assert(this.left, assertInterval, "left");
        Preconditions_1.Preconditions.assert(this.width, assertInterval, "width");
        Preconditions_1.Preconditions.assert(this.height, assertInterval, "height");
    }
    toPercentage() {
        return Percentages_1.Percentages.calculate(Rects_1.Rects.createFromBasicRect(this).area, ENTIRE_PAGE.area);
    }
    toFractionalRect() {
        const result = {
            left: this.left / 100,
            top: this.top / 100,
            width: this.width / 100,
            height: this.height / 100,
        };
        return Rects_1.Rects.createFromBasicRect(result);
    }
    toDimensions(dimensions) {
        Preconditions_1.Preconditions.assertPresent(dimensions, "dimensions");
        const fractionalRect = this.toFractionalRect();
        return Rects_1.Rects.createFromBasicRect({
            left: fractionalRect.left * dimensions.width,
            width: fractionalRect.width * dimensions.width,
            top: fractionalRect.top * dimensions.height,
            height: fractionalRect.height * dimensions.height,
        });
    }
    toDimensionsFloor(dimensions) {
        Preconditions_1.Preconditions.assertPresent(dimensions, "dimensions");
        const fractionalRect = this.toFractionalRect();
        return Rects_1.Rects.createFromBasicRect({
            left: Math.floor(fractionalRect.left * dimensions.width),
            width: Math.floor(fractionalRect.width * dimensions.width),
            top: Math.floor(fractionalRect.top * dimensions.height),
            height: Math.floor(fractionalRect.height * dimensions.height),
        });
    }
}
exports.AnnotationRect = AnnotationRect;
//# sourceMappingURL=AnnotationRect.js.map