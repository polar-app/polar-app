"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DocFormats } = require("../docformat/DocFormats");
const { HTMLViewer } = require("./html/HTMLViewer");
const { PDFViewer } = require("./pdf/PDFViewer");
class ViewerFactory {
    static create() {
        switch (DocFormats.getFormat()) {
            case "html":
                return new HTMLViewer();
            case "pdf":
                return new PDFViewer();
            default:
                return null;
        }
    }
}
exports.ViewerFactory = ViewerFactory;
//# sourceMappingURL=ViewerFactory.js.map