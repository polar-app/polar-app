"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEntry = void 0;
const Objects_1 = require("polar-shared/src/util/Objects");
class CacheEntry {
    constructor(options) {
        this.headers = {};
        this.statusCode = 200;
        this.statusMessage = "OK";
        this.contentType = "text/html";
        this.mimeType = "text/html";
        this.encoding = "UTF-8";
        this.method = "GET";
        this.url = options.url;
        Object.assign(this, options);
        Objects_1.Objects.defaults(this, {
            method: "GET",
            headers: {},
            statusCode: 200,
            statusMessage: "OK",
            contentType: "text/html",
            mimeType: "text/html",
            encoding: "UTF-8",
        });
    }
}
exports.CacheEntry = CacheEntry;
//# sourceMappingURL=CacheEntry.js.map