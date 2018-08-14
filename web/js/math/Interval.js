"use strict";
const { Line } = require("../util/Line");
class Interval {
    constructor(start, end) {
        this.line = new Line(start, end, "x");
    }
    containsPoint(pt) {
        return this.line.containsPoint(pt);
    }
}
module.exports.Interval = Interval;
//# sourceMappingURL=Interval.js.map