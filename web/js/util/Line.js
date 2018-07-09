
/**
 * Simple line with just a start and end.
 */
class Line {

    /**
     *
     * @param start {number}
     * @param end {number}
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    /**
     * The width of the line. Not to be confused with the width of a rect.
     *
     * @return {number}
     */
    get width() {
        return this.end - this.start;
    }

    /**
     * Return true if the given point is between the start and end position
     * of the line (inclusive)
     *
     * @param pt {number}
     * @return {boolean}
     */
    containsPoint(pt) {
        return this.within(pt);
    }

    /**
     * Return true if the point is within the start and end points of this line.
     *
     * @param pt {number}
     */
    within(pt) {
        return this.start <= pt && pt <= this.end;
    }

    /**
     * Return true if the given line overlaps the current line.  IE either the start
     * or end point on the given line is between the start and end points of the
     * current line.
     *
     * @param line {Line}
     * @return {boolean}
     */
    overlaps(line) {
        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }

    toString() {
        return `{start: ${this.start}, end: ${this.end}}`;
    }

    /**
     *
     * @param start {number}
     * @param pt {number}
     * @param end {number}
     * @return {boolean}
     */
    static interval(start, pt, end) {
        return start <= pt && pt <= end;
    }

}

module.exports.Line = Line;

