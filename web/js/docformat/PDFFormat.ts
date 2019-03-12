import {CurrentDocState, DocFormat} from './DocFormat';
import {Preconditions} from '../Preconditions';

declare var window: any;

export class PDFFormat extends DocFormat {

    public readonly name = 'pdf';

    constructor() {
        super();
    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    public currentDocFingerprint() {

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
    public currentState(): CurrentDocState {

        Preconditions.assertNotNull(event, "event");

        return {
            nrPages: window.PDFViewerApplication.pagesCount,
            currentPageNumber: window.PDFViewerApplication.pdfViewer.currentPageNumber,
        };

    }

    public supportThumbnails() {
        return true;
    }

    public targetDocument(): HTMLDocument | null {
        return document;
    }

    public currentScale() {
        return window.PDFViewerApplication.pdfViewer._currentScale;
    }

}


