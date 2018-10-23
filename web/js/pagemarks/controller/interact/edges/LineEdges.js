"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../../../Preconditions");
class LineEdges {
    constructor(obj) {
        this.start = obj.start;
        this.end = obj.end;
        Preconditions_1.Preconditions.assertTypeOf(this.start, "boolean", "start");
        Preconditions_1.Preconditions.assertTypeOf(this.end, "boolean", "end");
    }
}
exports.LineEdges = LineEdges;
//# sourceMappingURL=LineEdges.js.map