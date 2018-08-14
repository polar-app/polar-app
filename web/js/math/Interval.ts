const {Line} = require("../util/Line");

/**
 * Represents a mathematical interval between two values.
 */
class Interval {

    public line: any;

    constructor(start: number, end: number) {
        this.line = new Line(start, end, "x");
    }

    containsPoint(pt: number) {
        return this.line.containsPoint(pt);
    }

}


module.exports.Interval = Interval;
