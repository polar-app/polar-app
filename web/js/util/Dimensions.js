"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
class Dimensions {
    constructor(obj) {
        this.width = obj.width;
        this.height = obj.height;
        Preconditions_1.Preconditions.assertNumber(this.height, "height");
        Preconditions_1.Preconditions.assertNumber(this.width, "width");
    }
    get area() {
        return this.width * this.height;
    }
    toString() {
        return `${this.width}x${this.height}`;
    }
}
exports.Dimensions = Dimensions;
//# sourceMappingURL=Dimensions.js.map