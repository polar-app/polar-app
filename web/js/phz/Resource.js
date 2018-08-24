"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Resource {
    constructor(opts) {
        this.meta = {};
        this.contentType = "text/html";
        this.mimeType = "text/html";
        this.encoding = "UTF-8";
        this.method = "GET";
        this.statusCode = 200;
        this.headers = {};
        this.id = opts.id;
        this.created = opts.created;
        this.url = opts.url;
        this.contentLength = opts.contentLength;
        this.title = opts.title;
        this.description = opts.description;
        Object.assign(this, opts);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map