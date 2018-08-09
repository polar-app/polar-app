const {DocFormats} = require("../docformat/DocFormats");
const {HTMLViewer} = require("./html/HTMLViewer");
const {PDFViewer} = require("./pdf/PDFViewer");

export class ViewerFactory {

    static create() {

        switch(DocFormats.getFormat()) {
            case "html":
                return new HTMLViewer();

            case "pdf":
                return new PDFViewer();

            default:
                return null;
        }

    }

}
