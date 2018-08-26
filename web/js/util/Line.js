"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
class Line {
    constructor(start, end, axis) {
        this.start = Preconditions_1.Preconditions.assertNumber(start, "start");
        this.end = Preconditions_1.Preconditions.assertNumber(end, "end");
        this.axis = axis;
    }
    get width() {
        return this.end - this.start;
    }
    get length() {
        return this.end - this.start;
    }
    containsPoint(pt) {
        return this.within(pt);
    }
    within(pt) {
        return this.start <= pt && pt <= this.end;
    }
    overlaps(line) {
        Preconditions_1.Preconditions.assertNotNull(line, "line");
        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }
    toString(fmt) {
        if (fmt === "interval") {
            return `[${this.start},${this.end}]`;
        }
        return `{start: ${this.start}, end: ${this.end}}`;
    }
    multiply(scalar) {
        return new Line(this.start * scalar, this.end * scalar, this.axis);
    }
    toJSON() {
        return {
            axis: this.axis,
            start: this.start,
            end: this.end,
            length: this.length
        };
    }
    static interval(start, pt, end) {
        return start <= pt && pt <= end;
    }
    static builder() {
        return new LineBuilder();
    }
}
exports.Line = Line;
class LineBuilder {
    setStart(value) {
        this.start = value;
        return this;
    }
    setEnd(value) {
        this.end = value;
        return this;
    }
    setLength(value) {
        this.length = value;
        return this;
    }
    setAxis(value) {
        this.axis = value;
        return this;
    }
    build() {
        let start = Preconditions_1.notNull(this.start);
        if (!Preconditions_1.isPresent(this.end) && Preconditions_1.isPresent(this.length)) {
            this.end = start + this.length;
        }
        let end = Preconditions_1.notNull(this.end);
        return new Line(start, end);
    }
}
//# sourceMappingURL=Line.js.map