"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interval = void 0;
const Line_1 = require("../util/Line");
class Interval {
    constructor(start, end) {
        this.line = new Line_1.Line(start, end, "x");
    }
    containsPoint(pt) {
        return this.line.containsPoint(pt);
    }
}
exports.Interval = Interval;
//# sourceMappingURL=Interval.js.map