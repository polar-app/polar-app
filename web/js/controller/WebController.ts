import {Model} from '../Model';
import {isPresent, notNull, Preconditions} from '../Preconditions';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {ContextMenuController} from '../contextmenu/ContextMenuController';
import {KeyEvents} from '../KeyEvents';
import {Logger} from '../logger/Logger';
import {Viewer} from '../viewer/Viewer';
import {DocTitleController} from './DocTitleController';
import {PagemarkController} from '../pagemarks/controller/PagemarkController';
import {SyncController} from './SyncController';
import {Controller} from './Controller';
import {TextHighlightController} from '../highlights/text/controller/TextHighlightController';
import {FlashcardsController} from '../flashcards/controller/FlashcardsController';
import {AnnotationsController} from '../annotations/controller/AnnotationsController';
import {DocFormat} from '../docformat/DocFormat';
import {AreaHighlightController} from '../highlights/area/controller/AreaHighlightController';
import {PagemarkCoverageEventListener} from '../pagemarks/controller/PagemarkCoverageEventListener';
import {DocDetails} from '../metadata/DocDetails';


const log = Logger.create();

export class WebController extends Controller {

    protected viewer: Viewer;

    /**
     * The document fingerprint that we have loaded to detect when the
     * documents have changed.  Note that this isn't a secure fingerprint
     * so we might want to change it in the future.
     */
    private docFingerprint?: string;

    private readonly docFormat: DocFormat;

    constructor(model: Model, viewer: Viewer) {

        super(Preconditions.assertNotNull(model, "model"));

        this.viewer = Preconditions.assertNotNull(viewer, "viewer");

        this.docFormat = notNull(DocFormatFactory.getInstance());

        new PagemarkController(model).start();
        new DocTitleController(this.model).start();
        new SyncController(this.model).start();

    }

    async start() {

        this.listenForDocumentLoad();
        await this.listenForKeyBindings();

        //new MouseTracer(document).start();

    }

    async onDocumentLoaded(fingerprint: string, nrPages: number, currentlySelectedPageNum: number) {

        let docDetail = this.viewer.docDetail();

        // TODO: move this into the importer to create the DocMeta once the
        // PHZ is created which also means this can be tested easily.
        DocDetails.merge(this.model.docMeta.docInfo, docDetail);

        await super.onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum)

        this.setupContextMenu();

    }

    setupContextMenu() {

        let contextMenuController = new ContextMenuController(this.model);
        contextMenuController.start();

    }

    listenForDocumentLoad() {

        let container = notNull(document.getElementById('viewerContainer'));

        container.addEventListener('pagesinit', this.detectDocumentLoadedEventListener.bind(this));
        container.addEventListener('updateviewarea', this.detectDocumentLoadedEventListener.bind(this));

        // run manually the first time in case we get lucky of we're running HTML
        //this.detectDocumentLoadedEventListener();

    }

    detectDocumentLoadedEventListener(event: Event) {

        let currentDocFingerprint = this.docFormat.currentDocFingerprint();

        if (currentDocFingerprint !== undefined && currentDocFingerprint !== this.docFingerprint) {

            log.info("controller: New document loaded!");

            let newDocumentFingerprint = currentDocFingerprint;

            let currentDocState = this.docFormat.currentState(event);

            this.onNewDocumentFingerprint(newDocumentFingerprint, currentDocState.nrPages, currentDocState.currentPageNumber);

        }

    }

    onNewDocumentFingerprint(newDocumentFingerprint: string, nrPages: number, currentPageNumber: number) {

        log.info(`Detected new document fingerprint (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages}, currentPageNumber=${currentPageNumber})`);

        this.docFingerprint = newDocumentFingerprint;

        this.onDocumentLoaded(newDocumentFingerprint, nrPages, currentPageNumber);

    }

    // FIXME: remake this binding to CreatePagemarkEntirePage
    async keyBindingPagemarkEntirePage(event: KeyboardEvent) {

        log.info("Marking entire page as read.");

        let pageElement = this.docFormat.getCurrentPageElement();

        if(pageElement) {

            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            this.erasePagemarks(pageNum);
            await this.createPagemark(pageNum);

        } else {
            log.warn("No current pageElement to create pagemark.");
        }

    }

    keyBindingErasePagemark() {
        log.info("Erasing pagemark.");
        let pageElement = <HTMLElement>this.docFormat.getCurrentPageElement();

        if(isPresent(pageElement)) {
            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
            this.erasePagemark(pageNum);
        }

    }

    async keyBindingListener(event: KeyboardEvent) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if (event.key) {

                // TODO: we should not use 'code' but should use 'key'... The
                // problem is that on OS X the key code returned 'Dead' but was
                // working before.  Not sure why it started breaking.
                switch (event.code) {

                    case "KeyE":
                        this.keyBindingErasePagemark();
                        break;

                    case "KeyN":
                        await this.keyBindingPagemarkEntirePage(event);
                        break;

                    default:
                        break;

                }

            }

        } else {
        }

    }

    async listenForKeyBindings() {

        document.addEventListener("keydown", this.keyBindingListener.bind(this));

        log.info("Key bindings registered");

        new TextHighlightController(this.model).start();

        new PagemarkCoverageEventListener(this, this.model).start();

        new FlashcardsController(this.model).start();

        await new AnnotationsController().start();

        new AreaHighlightController(this.model).start();

    }

}
