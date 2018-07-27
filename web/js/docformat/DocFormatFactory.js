"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Elements = require("../util/Elements").Elements;
var PDFFormat = require("./PDFFormat").PDFFormat;
var HTMLFormat = require("./HTMLFormat").HTMLFormat;
var DocFormat = require("./DocFormat").DocFormat;
/**
 * Get the proper docFormat to work with.
 */
var DocFormatFactory = /** @class */ (function () {
    function DocFormatFactory() {
    }
    /**
     *
     * @return {DocFormat}
     */
    DocFormatFactory.getInstance = function () {
        var polarDocFormat = DocFormatFactory.getPolarDocFormat();
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
    };
    DocFormatFactory.getPolarDocFormat = function () {
        var polarDocFormatElement = document.querySelector("meta[name='polar-doc-format']");
        if (polarDocFormatElement) {
            var content = polarDocFormatElement.getAttribute("content");
            if (content) {
                return content;
            }
        }
        return "none";
    };
    return DocFormatFactory;
}());
exports.DocFormatFactory = DocFormatFactory;
//# sourceMappingURL=DocFormatFactory.js.map