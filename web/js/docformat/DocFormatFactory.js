"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Elements } = require("../util/Elements");
const { PDFFormat } = require("./PDFFormat");
const { HTMLFormat } = require("./HTMLFormat");
const { DocFormat } = require("./DocFormat");
/**
 * Get the proper docFormat to work with.
 */
class DocFormatFactory {
    /**
     *
     * @return {DocFormat}
     */
    static getInstance() {
        let polarDocFormat = DocFormatFactory.getPolarDocFormat();
        if (polarDocFormat === "html") {
            return new HTMLFormat();
        }
        else if (polarDocFormat === "pdf") {
            return new PDFFormat();
        }
        else if (polarDocFormat == null) {
            return new PDFFormat();
        }
        else {
            throw new Error("Unable to handle the given format: " + polarDocFormat);
        }
    }
    static getPolarDocFormat() {
        let polarDocFormatElement = document.querySelector("meta[name='polar-doc-format']");
        if (polarDocFormatElement) {
            let content = polarDocFormatElement.getAttribute("content");
            if (content) {
                return content;
            }
        }
        return "none";
    }
}
exports.DocFormatFactory = DocFormatFactory;
//# sourceMappingURL=DocFormatFactory.js.map