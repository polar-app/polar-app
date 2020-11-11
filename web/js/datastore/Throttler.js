"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttler = void 0;
const Timeouts_1 = require("../util/Timeouts");
const Objects_1 = require("polar-shared/src/util/Objects");
class Throttler {
    constructor(delegate, opts = new DefaultThrottlerOpts()) {
        this.nrRequestsOutstanding = 0;
        this.lastExecuted = 0;
        this.delegate = delegate;
        this.opts = Objects_1.Objects.defaults(opts, new DefaultThrottlerOpts());
    }
    exec() {
        ++this.nrRequestsOutstanding;
        if (this.nrRequestsOutstanding > this.opts.maxRequests) {
            this.doExec();
        }
        else {
            if (this.timeout === undefined) {
                this.timeout =
                    Timeouts_1.Timeouts.setTimeout(() => this.doExecViaTimeout(), this.opts.maxTimeout);
            }
        }
    }
    doExecViaTimeout() {
        this.doExec();
        this.timeout = undefined;
    }
    doExec() {
        if (this.nrRequestsOutstanding === 0) {
            return;
        }
        try {
            this.delegate();
        }
        finally {
            if (this.timeout !== undefined) {
                this.timeout.clear();
                this.timeout = undefined;
            }
            this.nrRequestsOutstanding = 0;
        }
    }
    trace() {
        const now = Date.now();
        const delta = Math.floor(now - this.lastExecuted);
        this.lastExecuted = now;
    }
}
exports.Throttler = Throttler;
class DefaultThrottlerOpts {
    constructor() {
        this.maxRequests = 50;
        this.maxTimeout = 250;
    }
}
//# sourceMappingURL=Throttler.js.map