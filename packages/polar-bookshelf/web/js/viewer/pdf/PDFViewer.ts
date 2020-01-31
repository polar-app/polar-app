import {Logger} from 'polar-shared/src/logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';
import {ViewerTours} from '../../apps/viewer/ViewerTours';
import {Model} from '../../model/Model';
import {Stopwatches} from 'polar-shared/src/util/Stopwatches';
import {AppRuntime} from '../../AppRuntime';
import {WindowEvents} from '../../util/dom/WindowEvents';
import {PinchToZoom} from "../../ui/Gestures";
import {Analytics} from "../../analytics/Analytics";
import {AnalyticsInitializer} from "../../analytics/AnalyticsInitializer";

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

        AnalyticsInitializer.doInit();

        PinchToZoom.disable();

        const stopwatch = Stopwatches.create();

        this.model.registerListenerForDocumentLoaded(event => {

            ViewerTours.createWhenNecessary(event.fingerprint);

            log.notice("Document load time: " + stopwatch.stop());
            this.sendResizeEvent();

            // this.handleChromeSelectionFix();

            // TODO: only register this via prefs (if this feature is enabled).
            // Scrollers.register(Pagemarks.createExtender(this.model.docMeta), 'full');

        });

        this.disableSidebarKeyboardHandling();

    }

    public docDetail(): DocDetail | undefined {

        return {
            fingerprint: this.currentDocFingerprint(),
            title: window.PDFViewerApplication.pdfDocument._pdfInfo.title,
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
            window.PDFViewerApplication.pdfDocument._pdfInfo &&
            window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint != null) {

            return window.PDFViewerApplication.pdfDocument._pdfInfo.fingerprint;

        }

    }

    private sendResizeEvent() {

        if (AppRuntime.isBrowser()) {
            WindowEvents.sendResizeEvent();
        }

    }

}
