"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CachedRequest {
    constructor(opts) {
        this.url = opts.url;
        this.proxyRules = opts.proxyRules;
        this.proxyBypassRules = opts.proxyBypassRules;
        Object.assign(this, opts);
    }
}
exports.CachedRequest = CachedRequest;
//# sourceMappingURL=CachedRequest.js.map