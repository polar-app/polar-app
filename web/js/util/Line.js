
const {Preconditions} = require("../Preconditions");

/**
 * Simple line with just a start and end.
 */
class Line {

    /**
     *
     * @param start {number}
     * @param end {number}
     * @param [axis] {string} Optional axis parameter ('x' or 'y')
     */
    constructor(start, end, axis) {
        this.start = Preconditions.assertNumber(start, "start");
        this.end = Preconditions.assertNumber(end, "end");
        this.axis = axis; // TODO validate
        //this.length = length;
    }

    /**
     * The width of the line. Not to be confused with the width of a rect.
     *
     * @Deprecated The dimension of a line is length. Not width. Use length()
     * instead.
     * @return {number}
     */
    get width() {
        return this.end - this.start;
    }

    get length() {
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
        Preconditions.assertNotNull(line, "line");

        //console.log("DEBUG: %s vs %s", this.toString("interval"), line.toString("interval"));

        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }

    /**
     *
     * @param [fmt] optional format parameter. May be 'interval' for interval notation.
     * @return {string}
     */
    toString(fmt) {

        if(fmt === "interval") {
            return `[${this.start},${this.end}]`;
        }

        return `{start: ${this.start}, end: ${this.end}}`;

    }

    /**
     * Build a new line based on the given scalar.  Essentially this models
     * the line as a vector with zero as the origin and length as the magnitude
     * and we just apply the scalar to build the new vector with a different
     * start origin.
     *
     * @param scalar {number}
     */
    multiply(scalar) {

        return new Line(this.start * scalar, this.end * scalar, this.axis);

    }

    toJSON() {

        return {
            axis: this.axis,
            start: this.start,
            end: this.end,
            length: this.length
        }

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

    /**
     * @return {LineBuilder}
     */
    static builder() {
        return new LineBuilder();
    }

}

class LineBuilder {

    constructor() {

        /**
         * @type {number}
         */
        this._start = undefined;

        /**
         * @type {number}
         */
        this._end = undefined;

        /**
         * @type {number}
         */
        this._length = undefined;

        /**
         * @type {string}
         */
        this._axis = axis;

    }


    /**
     * @param value {number}
     * @return {LineBuilder}
     */
    setStart(value) {
        Preconditions.assertNumber(value, "value");
        this.start = value;
        return this;
    }

    /**
     * @param value {number}
     * @return {LineBuilder}
     */
    setEnd(value) {
        Preconditions.assertNumber(value, "value");
        this.end = value;
        return this;
    }

    /**
     * @param value {number}
     * @return {LineBuilder}
     */
    setLength(value) {
        Preconditions.assertNumber(value, "value");
        this.length = value;
        return this;
    }

    /**
     * @param value {number}
     * @return {LineBuilder}
     */
    setAxis(value) {
        Preconditions.assertNotNull(axis, "value");
        this.axis = value;
        return this;
    }

    /**
     *
     * @return {Line}
     */
    build() {

        Preconditions.assertNumber(this._start, "start");

        if(! this._end && this._length) {
            this._end = this._start + this._length;
        }

        Preconditions.assertNumber(this._end, "end");

        return new Line(this._start, this._end);

    }

}

module.exports.Line = Line;

