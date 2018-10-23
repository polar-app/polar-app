"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../../../Preconditions");
const LineEdges_1 = require("./LineEdges");
class RectEdges {
    constructor(obj) {
        this.left = obj.left;
        this.top = obj.top;
        this.right = obj.right;
        this.bottom = obj.bottom;
        Preconditions_1.Preconditions.assertTypeOf(this.left, "boolean", "left");
        Preconditions_1.Preconditions.assertTypeOf(this.top, "boolean", "top");
        Preconditions_1.Preconditions.assertTypeOf(this.right, "boolean", "right");
        Preconditions_1.Preconditions.assertTypeOf(this.bottom, "boolean", "bottom");
    }
    toLineEdges(axis) {
        if (axis === "x") {
            return new LineEdges_1.LineEdges({ start: this.left, end: this.right });
        }
        else if (axis === "y") {
            return new LineEdges_1.LineEdges({ start: this.top, end: this.bottom });
        }
        else {
            throw new Error("Unknown axis: " + axis);
        }
    }
}
exports.RectEdges = RectEdges;
//# sourceMappingURL=RectEdges.js.map