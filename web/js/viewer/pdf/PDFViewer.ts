import {Logger} from '../../logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {ViewerTours} from '../../apps/viewer/ViewerTours';
import {Model} from '../../model/Model';
import {Stopwatches} from '../../util/Stopwatches';

declare var window: any;

const log = Logger.create();

export class PDFViewer extends Viewer {

    private readonly model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    public start() {

        log.info("Starting PDFViewer");

        RendererAnalytics.pageview("/pdfviewer");

        const stopwatch = Stopwatches.create();

        this.model.registerListenerForDocumentLoaded(event => {

            ViewerTours.createWhenNecessary(event.fingerprint);

            log.notice("Document load time: " + stopwatch.stop());

        });

        this.disableSidebarKeyboardHandling();

    }

    public docDetail(): DocDetail | undefined {

        return {
            fingerprint: this.currentDocFingerprint(),
            title: window.PDFViewerApplication.pdfDocument.pdfInfo.title,
            nrPages: window.PDFViewerApplication.pagesCount,
            filename: this.getFilename()
        };

    }

    private disableSidebarKeyboardHandling() {

        const sidebarElement = document.querySelector(".polar-sidebar")!;

        sidebarElement.addEventListener("keypress", event => {
            event.stopPropagation();
        });

        sidebarElement.addEventListener("keydown", event => {
            event.stopPropagation();
        });

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    private currentDocFingerprint() {

        if (window.PDFViewerApplication &&
            window.PDFViewerApplication.pdfDocument &&
            window.PDFViewerApplication.pdfDocument.pdfInfo &&
            window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint != null) {

            return window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;

        }

    }

}
