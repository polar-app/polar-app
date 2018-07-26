
const {TextHighlightController} = require("../highlights/text/controller/TextHighlightController");
const {AreaHighlightController} = require("../highlights/area/controller/AreaHighlightController");
const {PagemarkCoverageEventListener} = require("../pagemarks/controller/PagemarkCoverageEventListener.js");
const {KeyEvents} = require("../KeyEvents.js");
const {Preconditions} = require("../Preconditions.js");
const {Controller} = require("./Controller.js");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const {ContextMenuController} = require("../contextmenu/ContextMenuController");
const {FlashcardsController} = require("../flashcards/controller/FlashcardsController");
//const {AnnotationsController} = require("../annotations/controller/AnnotationsController");
const {MouseTracer} = require("../mouse/MouseTracer");

const log = require("../logger/Logger").create();

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

        //new MouseTracer(document).start();

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

            log.info("controller: New document loaded!");

            let newDocumentFingerprint = currentDocFingerprint;

            let currentDocState = this.docFormat.currentState(event);

            this.onNewDocumentFingerprint(newDocumentFingerprint, currentDocState.nrPages, currentDocState.currentPageNumber);

        }

    }

    onNewDocumentFingerprint(newDocumentFingerprint, nrPages, currentPageNumber) {

        log.info(`Detected new document fingerprint (fingerprint=${newDocumentFingerprint}, nrPages=${nrPages}, currentPageNumber=${currentPageNumber})`);

        this.docFingerprint = newDocumentFingerprint;

        this.onDocumentLoaded(newDocumentFingerprint, nrPages, currentPageNumber);

    }

    // FIXME: remake this binding to CreatePagemarkEntirePage
    async keyBindingPagemarkEntirePage(event) {

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

    keyBindingPagemarkUpToMouse(event) {
        log.info("Marking page as read up to mouse point");
    }

    keyBindingErasePagemark(event) {
        log.info("Erasing pagemark.");
        let pageElement = this.docFormat.getCurrentPageElement();
        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
        this.erasePagemark(pageNum);
    }

    async keyBindingListener(event) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if (event.key) {

                // TODO: we should not use 'code' but should use 'key'... The
                // problem is that on OS X the key code returned 'Dead' but was
                // working before.  Not sure why it started breaking.
                switch (event.code) {

                    case "KeyE":
                        this.keyBindingErasePagemark(event);
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

    listenForKeyBindings() {

        document.addEventListener("keydown", this.keyBindingListener.bind(this));

        log.info("Key bindings registered");

        new TextHighlightController(this.model).start();

        new PagemarkCoverageEventListener(this, this.model).start();

        new FlashcardsController(this.model).start();

        //new AnnotationsController().start();

        new AreaHighlightController(this.model).start();

    }

}

module.exports.WebController = WebController;
