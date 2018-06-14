const {Elements} = require("../util/Elements");
const {PDFFormat} = require("./PDFFormat");
const {HTMLFormat} = require("./HTMLFormat");
const {DocFormat} = require("./DocFormat");

/**
 * Get the proper docFormat to work with.
 */
class DocFormatFactory {

    static getInstance() {

        let polarDocFormat = document.querySelector("meta[name='polar-doc-format']");

        if(polarDocFormat) {
            polarDocFormat = polarDocFormat.getAttribute("content");
        }

        if(polarDocFormat === "html") {
            return new HTMLFormat();
        } else if (polarDocFormat === "pdf") {
            return new PDFFormat();
        } else if(polarDocFormat == null) {
            return new PDFFormat();
        } else {
            throw new Error("Unable to handle the given format: " + polarDocFormat);
        }

    }

}

module.exports.DocFormatFactory = DocFormatFactory;
