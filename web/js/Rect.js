"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dimensions_1 = require("./util/Dimensions");
const Line_1 = require("./util/Line");
const Preconditions_1 = require("./Preconditions");
class Rect {
    constructor(obj = {}) {
        Preconditions_1.Preconditions.assertNotNull(obj, "obj");
        this.left = obj.left;
        this.top = obj.top;
        this.right = obj.right;
        this.bottom = obj.bottom;
        this.width = obj.width;
        this.height = obj.height;
    }
    toLine(axis) {
        if (axis === "x") {
            return new Line_1.Line(this.left, this.right, axis);
        }
        else if (axis === "y") {
            return new Line_1.Line(this.top, this.bottom, axis);
        }
        else {
            throw new Error("Wrong axis: " + axis);
        }
    }
    get dimensions() {
        return new Dimensions_1.Dimensions({
            width: this.width,
            height: this.height
        });
    }
    get area() {
        return this.width * this.height;
    }
    adjustAxis(line) {
        Preconditions_1.Preconditions.assertNotNull(line, "line");
        Preconditions_1.Preconditions.assertNotNull(line.axis, "line.axis");
        let result = new Rect(this);
        if (line.axis === "x") {
            result.left = line.start;
            result.right = line.end;
            result.width = line.end - line.start;
        }
        else if (line.axis === "y") {
            result.top = line.start;
            result.bottom = line.end;
            result.height = line.end - line.start;
        }
        else {
            throw new Error("Invalid axis: " + line.axis);
        }
        return result;
    }
}
exports.Rect = Rect;
//# sourceMappingURL=Rect.js.map