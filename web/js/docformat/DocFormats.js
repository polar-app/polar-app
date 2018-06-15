const {Elements} = require("../util/Elements");
const {PDFFormat} = require("./PDFFormat");
const {HTMLFormat} = require("./HTMLFormat");
const {DocFormat} = require("./DocFormat");

/**
 *
 */
class DocFormats {

    /**
     * Get the doc format we're using (html, pdf, etc). Otherwise return null.
     * @return {*}
     */
    static getFormat() {

        let polarDocFormat = document.querySelector("meta[name='polar-doc-format']");

        if(polarDocFormat) {
            return polarDocFormat.getAttribute("content");
        }

        return null;

    }

}

module.exports.DocFormats = DocFormats;
