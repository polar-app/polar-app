"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CaptureOpts {
    constructor(opts = {}) {
        this.amp = true;
        this.pendingWebRequestsCallback = opts.pendingWebRequestsCallback;
        Object.assign(this, opts);
    }
}
exports.CaptureOpts = CaptureOpts;
//# sourceMappingURL=CaptureOpts.js.map