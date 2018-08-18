"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const DocFormatFactory_1 = require("../docformat/DocFormatFactory");
const ContextMenuController_1 = require("../contextmenu/ContextMenuController");
const KeyEvents_1 = require("../KeyEvents");
const Logger_1 = require("../logger/Logger");
const DocTitleController_1 = require("./DocTitleController");
const PagemarkController_1 = require("../pagemarks/controller/PagemarkController");
const SyncController_1 = require("./SyncController");
const { TextHighlightController } = require("../highlights/text/controller/TextHighlightController");
const { AreaHighlightController } = require("../highlights/area/controller/AreaHighlightController");
const { PagemarkCoverageEventListener } = require("../pagemarks/controller/PagemarkCoverageEventListener");
const { Controller } = require("./Controller");
const { FlashcardsController } = require("../flashcards/controller/FlashcardsController");
const { AnnotationsController } = require("../annotations/controller/AnnotationsController");
const { MouseTracer } = require("../mouse/MouseTracer");
const log = Logger_1.Logger.create();
class WebController extends Controller {
    constructor(model, viewer) {
        super(Preconditions_1.Preconditions.assertNotNull(model, "model"));
        this.viewer = Preconditions_1.Preconditions.assertNotNull(viewer, "viewer");
        this.docFingerprint = null;
        this.docFormat = Preconditions_1.notNull(DocFormatFactory_1.DocFormatFactory.getInstance());
        new PagemarkController_1.PagemarkController(model).start();
        new DocTitleController_1.DocTitleController(this.model).start();
        new SyncController_1.SyncController(this.model).start();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.listenForDocumentLoad();
            yield this.listenForKeyBindings();
        });
    }
    onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum) {
        super.onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum);
        let docDetails = this.viewer.docDetails();
        log.info("Loaded with docDetails: ", docDetails);
        this.setupContextMenu();
    }
    setupContextMenu() {
        let contextMenuController = new ContextMenuController_1.ContextMenuController(this.model);
        contextMenuController.start();
    }
    listenForDocumentLoad() {
        let container = Preconditions_1.notNull(document.getElementById('viewerContainer'));
        container.addEventListener('pagesinit', this.detectDocumentLoadedEventListener.bind(this));
        container.addEventListener('updateviewarea', this.detectDocumentLoadedEventListener.bind(this));
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
    keyBindingPagemarkEntirePage(event) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Marking entire page as read.");
            let pageElement = this.docFormat.getCurrentPageElement();
            if (pageElement) {
                let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
                this.erasePagemarks(pageNum);
                yield this.createPagemark(pageNum);
            }
            else {
                log.warn("No current pageElement to create pagemark.");
            }
        });
    }
    keyBindingErasePagemark() {
        log.info("Erasing pagemark.");
        let pageElement = this.docFormat.getCurrentPageElement();
        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
        this.erasePagemark(pageNum);
    }
    keyBindingListener(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (KeyEvents_1.KeyEvents.isKeyMetaActive(event)) {
                if (event.key) {
                    switch (event.code) {
                        case "KeyE":
                            this.keyBindingErasePagemark();
                            break;
                        case "KeyN":
                            yield this.keyBindingPagemarkEntirePage(event);
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
            }
        });
    }
    listenForKeyBindings() {
        return __awaiter(this, void 0, void 0, function* () {
            document.addEventListener("keydown", this.keyBindingListener.bind(this));
            log.info("Key bindings registered");
            new TextHighlightController(this.model).start();
            new PagemarkCoverageEventListener(this, this.model).start();
            new FlashcardsController(this.model).start();
            yield new AnnotationsController().start();
            new AreaHighlightController(this.model).start();
        });
    }
}
exports.WebController = WebController;
//# sourceMappingURL=WebController.js.map