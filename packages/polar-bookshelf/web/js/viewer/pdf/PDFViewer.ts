import {Logger} from 'polar-shared/src/logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';
import {ViewerTours} from '../../apps/viewer/ViewerTours';
import {Model} from '../../model/Model';
import {Stopwatches} from 'polar-shared/src/util/Stopwatches';
import {WindowEvents} from '../../util/dom/WindowEvents';
import {PinchToZoom} from "../../ui/Gestures";
import {AnalyticsInitializer} from "../../analytics/AnalyticsInitializer";
import {KnownPrefs} from "../../util/prefs/KnownPrefs";
import {Scrollers} from "polar-pagemarks-auto/src/Scrollers";
import {Pagemarks} from "../../metadata/Pagemarks";
import { AppRuntime } from 'polar-shared/src/util/AppRuntime';

declare var window: any;

const log = Logger.create();

interface ViewerConfig {
    readonly autoPagemarks: boolean;
}

export class PDFViewer extends Viewer {

    constructor(private readonly model: Model) {
        super();
    }

    private config(): ViewerConfig {
        const persistenceLayer = this.model.persistenceLayerProvider();
        const prefs = persistenceLayer.datastore.getPrefs();

        const autoPagemarks = prefs.get().isMarked(KnownPrefs.AUTO_PAGEMARKS);

        return {
            autoPagemarks
        };
    }

    public start() {

        log.info("Starting PDFViewer");

        AnalyticsInitializer.doInit();

        PinchToZoom.disable();

        const stopwatch = Stopwatches.create();

        const config = this.config();

        this.model.registerListenerForDocumentLoaded(event => {

            ViewerTours.createWhenNecessary(event.fingerprint);

            log.notice("Document load time: " + stopwatch.stop());
            this.sendResizeEvent();

            // this.handleChromeSelectionFix();

            log.notice("config: ", config);

            if (config.autoPagemarks) {
                log.notice("Using auto pagemarks");
                Scrollers.register(Pagemarks.createExtender(this.model.docMeta), 'full');
            }

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

        // this is necessary because pdf.js has regular key bindings like 'r'
        // which would rotate the document.  This means if you were using the
        // sidebar and typed 'regular' the PDF viewer would rotate on you which
        // is not what we want.

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
