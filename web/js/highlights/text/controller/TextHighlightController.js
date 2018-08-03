"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Logger_1 = require("../../../logger/Logger");
const JQuery_1 = __importDefault(require("../../../ui/JQuery"));
const { TextHighlightRecords } = require("../../../metadata/TextHighlightRecords");
const { TextHighlighterFactory } = require("./TextHighlighterFactory");
const { TextHighlightRows } = require("./TextHighlightRows");
const { Preconditions } = require("../../../Preconditions");
const { TextExtracter } = require("./TextExtracter");
const { KeyEvents } = require("../../../KeyEvents.js");
const { DocFormatFactory } = require("../../../docformat/DocFormatFactory");
const { SelectedContents } = require("../selection/SelectedContents");
const { TextSelections } = require("./TextSelections");
const log = Logger_1.Logger.create();
class TextHighlightController {
    constructor(model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory.getInstance();
        electron_1.ipcRenderer.on('context-menu-command', (event, arg) => {
            switch (arg.command) {
                case "delete-text-highlight":
                    this.onTextHighlightDeleted(arg);
                    break;
                default:
                    console.warn("Unhandled command: " + arg.command);
                    break;
            }
        });
    }
    onDocumentLoaded() {
        log.info("TextHighlightController.onDocumentLoaded: ", this.model.docMeta);
        this.textHighlighter = this.createTextHighlighter();
    }
    start() {
        document.addEventListener("keydown", this.keyBindingListener.bind(this));
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }
    keyBindingListener(event) {
        if (KeyEvents.isKeyMetaActive(event)) {
            if (event.code) {
                switch (event.code) {
                    case "KeyT":
                        this.doHighlight();
                        break;
                    default:
                        break;
                }
            }
        }
    }
    doHighlight() {
        if (this.docFormat.name === "html") {
            this.doHighlightModern();
        }
        else {
            this.doHighlightLegacy();
        }
    }
    doHighlightLegacy() {
        this.textHighlighter.doHighlight();
    }
    doHighlightModern() {
        console.log("Doing modern text highlight");
        this.onTextHighlightCreatedModern();
    }
    createTextHighlighter() {
        let sequence = 0;
        let controller = this;
        let textHighlighterOptions = {
            highlightedClass: "text-highlight-span",
            color: '',
            manual: true,
            onBeforeHighlight: (range) => {
                return true;
            },
            onAfterHighlight: function (range, highlightElements) {
                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;
                highlightElements.forEach(function (highlightElement) {
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });
                controller.onTextHighlightCreatedLegacy("." + highlightClazz);
                log.info("Removing highlights now");
                this.textHighlighter.removeHighlights();
            }.bind(this),
            onRemoveHighlight: function (hlt) {
                log.info("onRemoveHighlight hlt: ", hlt);
                return true;
            }
        };
        let targetDocument = this.docFormat.targetDocument();
        return TextHighlighterFactory.newInstance(targetDocument.body, textHighlighterOptions);
    }
    onTextHighlightDeleted(triggerEvent) {
        log.info("Deleting text highlight from model: ", triggerEvent);
        triggerEvent.matchingSelectors[".text-highlight"].annotationDescriptors.forEach(annotationDescriptor => {
            log.info("Deleting annotationDescriptor: ", JSON.stringify(annotationDescriptor, null, "  "));
            let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
            delete pageMeta.textHighlights[annotationDescriptor.id];
        });
        log.info("Deleting text highlight");
    }
    onTextHighlightCreatedLegacy(selector) {
        log.info("TextHighlightController.onTextHighlightCreatedLegacy");
        let textHighlightRows = TextHighlightRows.createFromSelector(selector);
        let rects = textHighlightRows.map(current => current.rect);
        let text = this.extractText(selector);
        let textSelections = TextExtracter.toTextSelections(textHighlightRows);
        let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);
        let currentPageMeta = this.docFormat.getCurrentPageMeta();
        let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);
        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;
        log.info("Added text highlight to model");
    }
    onTextHighlightCreatedModern() {
        log.info("TextHighlightController.onTextHighlightCreatedModern");
        let win = this.docFormat.targetDocument().defaultView;
        let selectedContent = SelectedContents.compute(win);
        console.log("Working with: " + JSON.stringify(selectedContent, null, "  "));
        let rectTexts = selectedContent.rectTexts;
        let rects = rectTexts.map(current => current.boundingPageRect);
        let text = selectedContent.text;
        let textSelections = TextSelections.compute(selectedContent);
        let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);
        let currentPageMeta = this.docFormat.getCurrentPageMeta();
        let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);
        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;
        log.info("Added text highlight to model");
        win.getSelection().empty();
    }
    extractText(selector) {
        let result = "";
        JQuery_1.default(selector).each(function () {
            result += "\n" + JQuery_1.default(this).text();
        });
        return result;
    }
}
exports.TextHighlightController = TextHighlightController;
//# sourceMappingURL=TextHighlightController.js.map