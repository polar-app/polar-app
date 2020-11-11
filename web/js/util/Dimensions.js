"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dimensions = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
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