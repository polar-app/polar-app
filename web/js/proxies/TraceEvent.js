"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MutationTypes_1 = require("./MutationTypes");
class TraceEvent {
    constructor(opts) {
        this.path = opts.path;
        this.mutationType = opts.mutationType;
        this.target = opts.target;
        this.property = opts.property;
        this.value = opts.value;
        this.previousValue = opts.previousValue;
        this.mutationState = MutationTypes_1.MutationTypes.toMutationState(this.mutationType);
    }
}
exports.TraceEvent = TraceEvent;
//# sourceMappingURL=TraceEvent.js.map