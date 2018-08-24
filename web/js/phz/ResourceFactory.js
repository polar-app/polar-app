"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hashcodes_1 = require("../Hashcodes");
const Resource_1 = require("./Resource");
class ResourceFactory {
    static create(url, contentType) {
        let id = Hashcodes_1.Hashcodes.createID(url, 20);
        let created = new Date().toISOString();
        let meta = {};
        let headers = {};
        return new Resource_1.Resource({ id, url, created, meta, contentType, headers });
    }
    static contentTypeToExtension(contentType) {
        if (contentType === "text/html") {
            return "html";
        }
        else {
            return "dat";
        }
    }
}
exports.ResourceFactory = ResourceFactory;
//# sourceMappingURL=ResourceFactory.js.map