"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResourceEntry {
    constructor(opts) {
        this.id = opts.id;
        this.path = opts.path;
        this.resource = opts.resource;
        Object.assign(this, opts);
    }
}
exports.ResourceEntry = ResourceEntry;
//# sourceMappingURL=ResourceEntry.js.map