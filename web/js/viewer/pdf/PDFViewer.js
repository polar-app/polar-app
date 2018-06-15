const {Viewer} = require("../Viewer");

class PDFViewer extends Viewer {

    start() {
        console.log("Starting PDFViewer");
    }

}

module.exports.PDFViewer = PDFViewer;
