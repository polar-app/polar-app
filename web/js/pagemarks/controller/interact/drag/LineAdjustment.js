"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rects_1 = require("../../../../Rects");
const Preconditions_1 = require("../../../../Preconditions");
const Objects_1 = require("../../../../util/Objects");
class LineAdjustment {
    constructor(obj) {
        this.overlapped = obj.overlapped;
        this.start = obj.start;
        this.previous = obj.previous;
        this.snapped = obj.snapped;
        this.delta = obj.delta;
        this.axis = obj.axis;
    }
    adjustRect(primaryRect) {
        let dir = {};
        dir[this.axis] = this.start;
        let absolute = true;
        return Rects_1.Rects.move(primaryRect, dir, absolute);
    }
    static create(opts) {
        Preconditions_1.Preconditions.assertNotNull(opts.start, "start");
        Preconditions_1.Preconditions.assertNotNull(opts.previous, "previous");
        Preconditions_1.Preconditions.assertNotNull(opts.snapped, "snapped");
        Preconditions_1.Preconditions.assertNotNull(opts.axis, "axis");
        opts = Objects_1.Objects.duplicate(opts);
        opts.overlapped = true;
        opts.delta = Math.abs(opts.previous - opts.start);
        return new LineAdjustment(opts);
    }
}
exports.LineAdjustment = LineAdjustment;
//# sourceMappingURL=LineAdjustment.js.map