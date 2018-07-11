const {Line} = require("../util/Line");

/**
 * Represents a mathematical interval between two values.
 */
class Interval {

    constructor(start, end) {
        this.line = new Line(start, end, "x");
    }

    containsPoint(pt) {
        return this.line.containsPoint(pt);
    }

}


module.exports.Interval = Interval;
