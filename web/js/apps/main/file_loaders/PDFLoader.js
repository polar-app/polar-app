"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFLoader = void 0;
const ResourcePaths_1 = require("../../../electron/webresource/ResourcePaths");
class PDFLoader {
    static createViewerURL(fingerprint, fileURL, filename) {
        return ResourcePaths_1.ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);
    }
}
exports.PDFLoader = PDFLoader;
//# sourceMappingURL=PDFLoader.js.map