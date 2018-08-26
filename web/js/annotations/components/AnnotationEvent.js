"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TraceEvent_1 = require("../../proxies/TraceEvent");
const Preconditions_1 = require("../../Preconditions");
class AnnotationEvent extends TraceEvent_1.TraceEvent {
    constructor(opts = {}) {
        super(opts);
        this.id = opts.id;
        this.docMeta = opts.docMeta;
        this.pageMeta = opts.pageMeta;
        this.pageNum = opts.pageNum;
        this.traceEvent = opts.traceEvent;
        this.container = opts.container;
        if (this.value) {
            this.id = this.value.id;
        }
        else {
            this.id = this.previousValue.id;
        }
        Preconditions_1.Preconditions.assertNotNull(this.pageMeta, "pageMeta");
    }
}
exports.AnnotationEvent = AnnotationEvent;
//# sourceMappingURL=AnnotationEvent.js.map