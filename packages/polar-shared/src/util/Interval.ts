import {ILine, Line} from './Line';

/**
 * Represents a mathematical interval between two values.
 */
export class Interval {

    public line: ILine;

    constructor(start: number, end: number) {
        this.line = new Line(start, end, "x");
    }

    public containsPoint(pt: number) {
        return this.line.containsPoint(pt);
    }

}
