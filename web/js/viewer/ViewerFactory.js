"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DocFormats } = require("../docformat/DocFormats");
const { HTMLViewer } = require("./html/HTMLViewer");
const { PDFViewer } = require("./pdf/PDFViewer");
class ViewerFactory {
    static create(model) {
        switch (DocFormats.getFormat()) {
            case "html":
                return new HTMLViewer(model);
            case "pdf":
                return new PDFViewer();
            default:
                return null;
        }
    }
}
exports.ViewerFactory = ViewerFactory;
//# sourceMappingURL=ViewerFactory.js.map