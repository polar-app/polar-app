/**
 * Represents a mathematical interval between two values.
 */
import {ILine, Line} from 'polar-shared/src/util/Line';

export class Interval {

    public line: ILine;

    constructor(start: number, end: number) {
        this.line = new Line(start, end, "x");
    }

    public containsPoint(pt: number) {
        return this.line.containsPoint(pt);
    }

}
