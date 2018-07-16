const $ = require('jquery');

const {TextHighlightController} = require("../highlights/text/controller/TextHighlightController");
const {PagemarkCoverageEventListener} = require("../pagemarks/controller/PagemarkCoverageEventListener.js");
const {KeyEvents} = require("../KeyEvents.js");
const {Preconditions} = require("../Preconditions.js");
const {Controller} = require("./Controller.js");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const {ContextMenuController} = require("../contextmenu/ContextMenuController");
const {FlashcardsController} = require("../flashcards/controller/FlashcardsController");

class WebController extends Controller {

    constructor(model) {
        super(Preconditions.assertNotNull(model, "model"));

        /**
         * The document fingerprint that we have loaded to detect when the
         * documents have changed.  Note that this isn't a secure fingerprint
         * so we might want to change it in the future.
         *
         * @type string
         */
        this.docFingerprint = null;

        this.docFormat = DocFormatFactory.getInstance();

    }

    start() {
        this.listenForDocumentLoad();
        this.listenForKeyBindings();
    }


    onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum) {

        // TODO: if I await super.onDocumentLoaded with webpack it breaks
        super.onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum);
        this.setupContextMenu();

    }

    setupContextMenu() {

        let contextMenuController = new ContextMenuController(this.model);
        contextMenuController.start();

    }

    listenForDocumentLoad() {

        let container = document.getElementById('viewerContainer');

        container.addEventListener('pagesinit', this.detectDocumentLoadedEventListener.bind(this));
        container.addEventListener('updateviewarea', this.detectDocumentLoadedEventListener.bind(this));

        // run manually the first time in case we get lucky of we're running HTML
        //this.detectDocumentLoadedEventListener();

    }

    detectDocumentLoadedEventListener(event) {

        let currentDocFingerprint = this.docFormat.currentDocFingerprint();

        if (currentDocFingerprint !== this.docFingerprint) {

            console.log("controller: New document loaded!");

            let newDocumentFingerprint = currentDocFingerprint;

            let currentDocState = this.docFormat.currentState(event);

            this.onNewDocumentFingerprint(newDocumentFingerprint, currentDocState.nrPages, currentDocState.currentPageNumber);

        }

    }

    onNewDocumentFingerprint(newDocumentFingerprint, nrPages, currentPageNumber) {

        console.log(`Detected new document fingerprint (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages}, currentPageNumber=${currentPageNumber})`);

        this.docFingerprint = newDocumentFingerprint;

        this.onDocumentLoaded(newDocumentFingerprint, nrPages, currentPageNumber);

    }

    traceEventOnPage(event, eventName) {
        let pageElement = event.target.parentElement;
        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

        console.log(`Found event ${eventName} on page number ${pageNum}`);

    }

    onViewerElementInserted() {

        // FIXME: try to use window.PDFViewerApplication.eventBus with:
        //
        // documentload, pagerendered, textlayerrendered, pagechange, and pagesinit...

        if (this.docFormat.currentDocFingerprint() !== this.docFingerprint) {

            let newDocumentFingerprint = window.PDFViewerApplication.pdfDocument.pdfInfo.fingerprint;
            let nrPages = window.PDFViewerApplication.pagesCount;

            let pages = document.querySelectorAll("#viewer .page");

            // FIXME:: I need to find the current selected page
            let currentPageNumber = window.PDFViewerApplication.pdfViewer.currentPageNumber;

            if (pages.length === nrPages) {
                this.onNewDocumentFingerprint(newDocumentFingerprint, nrPages, currentPageNumber);
            }

        }

    }

    // FIXME: remake this binding to CreatePagemarkEntirePage
    async keyBindingPagemarkEntirePage(event) {

        console.log("Marking entire page as read.");

        let pageElement = this.docFormat.getCurrentPageElement();
        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

        this.erasePagemarks(pageNum);
        await this.createPagemark(pageNum);

    }

    keyBindingPagemarkUpToMouse(event) {
        console.log("Marking page as read up to mouse point");
    }

    keyBindingErasePagemark(event) {
        console.log("Erasing pagemark.");
        let pageElement = this.docFormat.getCurrentPageElement();
        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
        this.erasePagemark(pageNum);
    }

    async keyBindingListener(event) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if (event.key) {

                switch (event.key.toLowerCase()) {

                    case "e":
                        this.keyBindingErasePagemark(event);
                        break;

                    case "m":
                        // FIXME this is no longer used here and has migrated to
                        // PagemarkCoverageEventListener
                        this.keyBindingPagemarkUpToMouse(event);
                        break;

                    case "n":
                        await this.keyBindingPagemarkEntirePage(event);
                        break;

                    default:
                        break;

                }

            }

        }

    }

    listenForKeyBindings() {

        document.addEventListener("keydown", this.keyBindingListener.bind(this));

        console.log("Key bindings registered");

        new TextHighlightController(this.model).start();

        new PagemarkCoverageEventListener(this).start();

        new FlashcardsController(this.model).start();

    }

}

module.exports.WebController = WebController;
