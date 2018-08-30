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
const Logger_1 = require("../../logger/Logger");
const DocFormatFactory_1 = require("../../docformat/DocFormatFactory");
const KeyEvents_1 = require("../../KeyEvents");
const Elements_1 = require("../../util/Elements");
const log = Logger_1.Logger.create();
class PagemarkCoverageEventListener {
    constructor(controller, model) {
        this.keyActivated = false;
        this.controller = controller;
        this.model = model;
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
    }
    start() {
        log.info("Starting...");
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
        log.info("Starting...done");
    }
    onDocumentLoaded() {
        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));
        document.querySelectorAll(".page").forEach(pageElement => {
            pageElement.addEventListener("click", this.mouseListener.bind(this));
        });
    }
    keyListener(event) {
        if (!event) {
            throw new Error("no event");
        }
        this.keyActivated = KeyEvents_1.KeyEvents.isKeyMetaActive(event);
    }
    mouseListener(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!event) {
                throw new Error("no event");
            }
            if (!this.keyActivated) {
                return;
            }
            yield this.onActivated(event);
        });
    }
    onActivated(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let pageElement = Elements_1.Elements.untilRoot(event.currentTarget, ".page");
            let pageHeight = pageElement.clientHeight;
            let eventTargetOffset = Elements_1.Elements.getRelativeOffsetRect(event.target, pageElement);
            let mouseY = eventTargetOffset.top + event.offsetY;
            let percentage = (mouseY / pageHeight) * 100;
            log.info("percentage: ", percentage);
            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
            this.controller.erasePagemark(pageNum);
            yield this.controller.createPagemark(pageNum, { percentage });
        });
    }
}
exports.PagemarkCoverageEventListener = PagemarkCoverageEventListener;
//# sourceMappingURL=PagemarkCoverageEventListener.js.map