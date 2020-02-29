import {CurrentDocState, DocFormat} from './DocFormat';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {PDFModernTextLayers} from "polar-pdf/src/pdf/PDFModernTextLayers";

declare var window: any;

export class PDFFormat extends DocFormat {

    public readonly name = 'pdf';

    constructor() {
        super();
    }

    public init() {

        this.initModernTextLayers();
        this.initCustomEventHandlers();

    }

    private initModernTextLayers() {
        PDFModernTextLayers.configure();
    }

    private initCustomEventHandlers() {

        const outerContainer = document.getElementById("outerContainer");

        if (outerContainer) {

            outerContainer.addEventListener("keydown", event => {

                // this disables the 'rotate' functionality which breaks Polar because
                // people accidentally rotate the document and can't figure out why then
                // get VERY confused about how to fix the problem.

                if (event.key === 'r') {
                    // TODO: shift and alt, etc might be blocked but I think that's ok
                    event.stopPropagation();
                    return false;
                }

                return true;

            });

        }
    }


    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    public currentDocFingerprint(): string | undefined {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument._pdfInfo &&
            window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint != null) {

            return Optional.of(window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint).getOrUndefined();

        }

        return undefined;

    }

    public setCurrentDocFingerprint(fingerprint: string): void {
        // noop
    }

    /**
     * Get the current state of the doc.
     */
    public currentState(): CurrentDocState {

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


