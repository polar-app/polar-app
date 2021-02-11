/**
 * Represents a mathematical interval between two values.
 */
import {ILine, Line} from '../util/Line';

export class Interval {

    public line: ILine;

    constructor(start: number, end: number) {
        this.line = new Line(start, end, "x");
    }

    containsPoint(pt: number) {
        return this.line.containsPoint(pt);
    }

}
