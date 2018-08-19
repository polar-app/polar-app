"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../logger/Logger");
const Viewer_1 = require("../Viewer");
const log = Logger_1.Logger.create();
class PDFViewer extends Viewer_1.Viewer {
    start() {
        super.start();
        log.info("Starting PDFViewer");
    }
}
exports.PDFViewer = PDFViewer;
//# sourceMappingURL=PDFViewer.js.map