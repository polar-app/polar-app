"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBLoader = void 0;
const ResourcePaths_1 = require("../../../electron/webresource/ResourcePaths");
class EPUBLoader {
    static createViewerURL(fingerprint) {
        return ResourcePaths_1.ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);
    }
}
exports.EPUBLoader = EPUBLoader;
//# sourceMappingURL=EPUBLoader.js.map