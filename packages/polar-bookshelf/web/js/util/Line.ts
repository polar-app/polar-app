import {isPresent, notNull, Preconditions} from 'polar-shared/src/Preconditions';

export type Axis = 'x' | 'y';

export interface ILine {

    readonly start: number;

    readonly end: number;

    readonly axis: Axis;

    readonly containsPoint: (pt: number) => boolean;

}

/**
 * Simple line with just a start and end.
 */
export class Line implements ILine {

    public readonly start: number;
    public readonly end: number;
    public readonly axis: Axis;

    constructor(start: number, end: number, axis: Axis) {
        this.start = Preconditions.assertNumber(start, "start");
        this.end = Preconditions.assertNumber(end, "end");
        this.axis = axis;
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
    containsPoint(pt: number) {
        return this.within(pt);
    }

    /**
     * Return true if the point is within the start and end points of this line.
     *
     * @param pt {number}
     */
    within(pt: number) {
        return this.start <= pt && pt <= this.end;
    }

    /**
     * Return true if the given line overlaps the current line.  IE either the start
     * or end point on the given line is between the start and end points of the
     * current line.
     *
     */
    overlaps(line: Line): boolean {
        Preconditions.assertNotNull(line, "line");

        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }

    /**
     *
     * @param [fmt] optional format parameter. May be 'interval' for interval notation.
     * @return {string}
     */
    toString(fmt: string) {

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
     */
    public multiply(scalar: number): Line {
        return new Line(this.start * scalar, this.end * scalar, this.axis);
    }

    /**
     * Call Math.floor on the points in this line.
     */
    public floor(): Line {
        return new Line(Math.floor(this.start), Math.floor(this.end), this.axis);
    }

    public toJSON() {

        return {
            axis: this.axis,
            start: this.start,
            end: this.end,
            length: this.length
        };

    }

    public static interval(start: number, pt: number, end: number): boolean {
        return start <= pt && pt <= end;
    }

    static builder() {
        return new LineBuilder();
    }

}

class LineBuilder {

    private start?: number;

    private end?: number;

    private length?: number;

    private axis?: Axis;

    setStart(value: number) {
        this.start = value;
        return this;
    }

    setEnd(value: number) {
        this.end = value;
        return this;
    }

    setLength(value: number) {
        this.length = value;
        return this;
    }

    setAxis(value: Axis) {
        this.axis = value;
        return this;
    }

    build() {

        const start = notNull(this.start);

        if(! isPresent(this.end) && isPresent(this.length)) {
            this.end = start + this.length!;
        }

        const end = notNull(this.end);

        return new Line(start, end, this.axis || 'x');

    }

}
