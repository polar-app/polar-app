const {Viewer} = require("../Viewer");
const log = require("../../logger/Logger").create();

class PDFViewer extends Viewer {

    start() {
        super.start();

        log.info("Starting PDFViewer");

    }

}

module.exports.PDFViewer = PDFViewer;
