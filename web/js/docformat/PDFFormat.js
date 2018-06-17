const {DocFormat} = require("./DocFormat");
const {Preconditions} = require("../Preconditions");

class PDFFormat extends DocFormat {

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    currentDocFingerprint() {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != null) {

            return window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;

        }

    }

    /**
     * Get the current state of the doc.
     */
    currentState(event) {

        Preconditions.assertNotNull(event, "event");

        return {
            nrPages: window.PDFViewerApplication.pagesCount,
            currentPageNumber: window.PDFViewerApplication.pdfViewer.currentPageNumber,
            pageElement: event.target.parentElement
        }

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

module.exports.PDFFormat = PDFFormat;
