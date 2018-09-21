import {Logger} from '../../logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';

declare var window: any;

const log = Logger.create();

export class PDFViewer extends Viewer {

    public start() {

        log.info("Starting PDFViewer");

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

    public docDetail(): DocDetail | undefined {

        return {
            fingerprint: this.currentDocFingerprint(),
            title: window.PDFViewerApplication.pdfDocument.pdfInfo.title,
            nrPages: window.PDFViewerApplication.pagesCount,
            filename: this.getFilename()
        };

    }

}
