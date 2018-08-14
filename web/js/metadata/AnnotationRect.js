"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const { Rects } = require("../Rects");
const { Interval } = require("../math/Interval");
const ENTIRE_PAGE = Rects.createFromBasicRect({ left: 0, top: 0, width: 100, height: 100 });
class AnnotationRect {
    constructor(obj) {
        this.left = obj.left;
        this.top = obj.top;
        this.width = obj.width;
        this.height = obj.height;
        Object.assign(this, obj);
        this._validate();
    }
    _validate() {
        let interval = new Interval(0, 100);
        let assertInterval = (value) => interval.containsPoint(value);
        Preconditions_1.Preconditions.assert(this.top, assertInterval, "top");
        Preconditions_1.Preconditions.assert(this.left, assertInterval, "left");
        Preconditions_1.Preconditions.assert(this.width, assertInterval, "width");
        Preconditions_1.Preconditions.assert(this.height, assertInterval, "height");
    }
    toPercentage() {
        return 100 * (Rects.createFromBasicRect(this).area / ENTIRE_PAGE.area);
    }
    toFractionalRect() {
        let result = {
            left: this.left / 100,
            top: this.top / 100,
            width: this.width / 100,
            height: this.height / 100,
        };
        return Rects.createFromBasicRect(result);
    }
    toDimensions(dimensions) {
        Preconditions_1.Preconditions.assertNotNull(dimensions, "dimensions");
        let fractionalRect = this.toFractionalRect();
        return Rects.createFromBasicRect({
            left: fractionalRect.left * dimensions.width,
            width: fractionalRect.width * dimensions.width,
            top: fractionalRect.top * dimensions.height,
            height: fractionalRect.height * dimensions.height,
        });
    }
}
exports.AnnotationRect = AnnotationRect;
//# sourceMappingURL=AnnotationRect.js.map