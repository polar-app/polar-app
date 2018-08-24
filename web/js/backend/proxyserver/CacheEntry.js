"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheEntry {
    constructor(options) {
        this.method = "GET";
        this.headers = {};
        this.statusCode = 200;
        this.statusMessage = "OK";
        this.contentType = "text/html";
        this.mimeType = "text/html";
        this.encoding = "UTF-8";
        this.method = "GET";
        this.url = options.url;
        Object.assign(this, options);
    }
}
exports.CacheEntry = CacheEntry;
//# sourceMappingURL=CacheEntry.js.map