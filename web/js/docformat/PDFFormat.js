"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocFormat_1 = require("./DocFormat");
const Preconditions_1 = require("../Preconditions");
class PDFFormat extends DocFormat_1.DocFormat {
    constructor() {
        super();
        this.name = "pdf";
    }
    currentDocFingerprint() {
        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != null) {
            return window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;
        }
    }
    currentState(event) {
        Preconditions_1.Preconditions.assertNotNull(event, "event");
        return {
            nrPages: window.PDFViewerApplication.pagesCount,
            currentPageNumber: window.PDFViewerApplication.pdfViewer.currentPageNumber,
            pageElement: event.target.parentElement
        };
    }
    supportThumbnails() {
        return true;
    }
    targetDocument() {
        return document;
    }
    currentScale() {
        return window.PDFViewerApplication.pdfViewer._currentScale;
    }
}
exports.PDFFormat = PDFFormat;
//# sourceMappingURL=PDFFormat.js.map