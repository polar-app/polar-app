"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../../logger/Logger");
const Preconditions_1 = require("../../../Preconditions");
const DocFormatFactory_1 = require("../../../docformat/DocFormatFactory");
const AnnotationRects_1 = require("../../../metadata/AnnotationRects");
const AreaHighlights_1 = require("../../../metadata/AreaHighlights");
const AnnotationPointers_1 = require("../../../annotations/AnnotationPointers");
const log = Logger_1.Logger.create();
class AreaHighlightController {
    constructor(model) {
        this.model = Preconditions_1.Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
    }
    onDocumentLoaded() {
        log.info("onDocumentLoaded: ", this.model.docMeta);
    }
    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
        window.addEventListener("message", event => this.onMessageReceived(event), false);
    }
    onMessageReceived(event) {
        if (event.data && event.data.type === "create-area-highlight") {
            this.onCreateAreaHighlight(event.data);
        }
        if (event.data && event.data.type === "delete-area-highlight") {
            this.onDeleteAreaHighlight(event.data);
        }
    }
    onCreateAreaHighlight(contextMenuLocation) {
        log.info("Creating area highlight: ", contextMenuLocation);
        let annotationRect = AnnotationRects_1.AnnotationRects.createFromEvent(contextMenuLocation);
        log.info("annotationRect", annotationRect);
        let areaHighlight = AreaHighlights_1.AreaHighlights.create({ rect: annotationRect });
        log.info("areaHighlight", areaHighlight);
        let docMeta = this.model.docMeta;
        let pageMeta = docMeta.getPageMeta(contextMenuLocation.pageNum);
        pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;
    }
    onDeleteAreaHighlight(triggerEvent) {
        let annotationPointers = AnnotationPointers_1.AnnotationPointers.toAnnotationPointers(".area-highlight", triggerEvent);
        annotationPointers.forEach(annotationPointer => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationPointer.pageNum);
            delete pageMeta.areaHighlights[annotationPointer.id];
        });
    }
}
exports.AreaHighlightController = AreaHighlightController;
//# sourceMappingURL=AreaHighlightController.js.map