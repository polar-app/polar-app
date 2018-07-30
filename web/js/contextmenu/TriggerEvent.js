"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TriggerEvent {
    constructor(point, points, pageNum, contextMenuTypes, matchingSelectors, docDescriptor) {
        this.point = point;
        this.points = points;
        this.pageNum = pageNum;
        this.contextMenuTypes = contextMenuTypes;
        this.matchingSelectors = matchingSelectors;
        this.docDescriptor = docDescriptor;
    }
    static create(opts) {
        let result = Object.create(TriggerEvent.prototype);
        result = Object.assign(result, opts);
        return result;
    }
}
exports.TriggerEvent = TriggerEvent;
//# sourceMappingURL=TriggerEvent.js.map