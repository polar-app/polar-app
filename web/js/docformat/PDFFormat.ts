import {DocFormat} from './DocFormat';
import {Preconditions} from '../Preconditions';

declare var window: any;

export class PDFFormat extends DocFormat {

    public readonly name: string;

    constructor() {
        super();
        this.name = "pdf";
    }

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
    currentState(event: any) {

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


