const {DocFormats} = require("../docformat/DocFormats");

class ViewerFactory {

    static create() {

        switch(DocFormats.getFormat()) {
            case "html":
                return new HTMLviewer();

            case "pdf":
                return new PDFViewer();

            default:
                return null;
        }

    }

}

module.exports.ViewerFactory = ViewerFactory;
