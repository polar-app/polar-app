"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = require("../../Rect");
const Preconditions_1 = require("../../Preconditions");
class BoxMoveEvent {
    constructor(opts) {
        this.state = "pending";
        this.type = opts.type;
        this.restrictionRect = opts.restrictionRect;
        this.boxRect = opts.boxRect;
        this.id = opts.id;
        this.target = opts.target;
        this.state = "pending";
        Object.assign(this, opts);
        Preconditions_1.Preconditions.assertInstanceOf(this.boxRect, Rect_1.Rect, "boxRect");
    }
}
exports.BoxMoveEvent = BoxMoveEvent;
//# sourceMappingURL=BoxMoveEvent.js.map