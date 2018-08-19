"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocFormatFactory_1 = require("../../docformat/DocFormatFactory");
const AnnotationPointers_1 = require("../../annotations/AnnotationPointers");
const Logger_1 = require("../../logger/Logger");
const Pagemarks_1 = require("../../metadata/Pagemarks");
const PagemarkRects_1 = require("../../metadata/PagemarkRects");
const PagemarkMode_1 = require("../../metadata/PagemarkMode");
const { Rects } = require("../../Rects");
const log = Logger_1.Logger.create();
class PagemarkController {
    constructor(model) {
        this.model = model;
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
    }
    start() {
        window.addEventListener("message", event => this.onMessageReceived(event), false);
    }
    onMessageReceived(event) {
        log.info("Received message: ", event);
        let triggerEvent = event.data;
        switch (event.data.type) {
            case "create-pagemark":
                this.onCreatePagemark(triggerEvent);
                break;
            case "delete-pagemark":
                this.onDeletePagemark(triggerEvent);
                break;
            case "set-pagemark-mode-read":
                this.onSetPagemarkMode(triggerEvent, PagemarkMode_1.PagemarkMode.READ);
                break;
            case "set-pagemark-mode-ignored":
                this.onSetPagemarkMode(triggerEvent, PagemarkMode_1.PagemarkMode.IGNORED);
                break;
        }
    }
    onCreatePagemark(triggerEvent) {
        let elements = document.elementsFromPoint(triggerEvent.points.client.x, triggerEvent.points.client.y);
        elements = elements.filter(element => element.matches(".page"));
        if (elements.length === 1) {
            let pageElement = elements[0];
            log.info("Creating box on pageElement: ", pageElement);
            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
            let pageElementPoint = triggerEvent.points.pageOffset;
            let boxRect = Rects.createFromBasicRect({
                left: pageElementPoint.x,
                top: pageElementPoint.y,
                width: 150,
                height: 150
            });
            log.info("Placing box at: ", boxRect);
            let containerRect = Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: pageElement.offsetWidth,
                height: pageElement.offsetHeight
            });
            let pagemarkRect = PagemarkRects_1.PagemarkRects.createFromPositionedRect(boxRect, containerRect);
            let pagemark = Pagemarks_1.Pagemarks.create({ rect: pagemarkRect });
            this.model.docMeta.getPageMeta(pageNum).pagemarks[pagemark.id] = pagemark;
            log.info("Using pagemarkRect: ", pagemarkRect);
        }
        else {
            log.warn("Wrong number of elements selected: " + elements.length);
        }
    }
    onDeletePagemark(triggerEvent) {
        log.info("Deleting pagemark: ", triggerEvent);
        let annotationPointers = AnnotationPointers_1.AnnotationPointers.toAnnotationPointers(".pagemark", triggerEvent);
        log.info("Working with annotationPointers: ", annotationPointers);
        annotationPointers.forEach(annotationPointer => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationPointer.pageNum);
            delete pageMeta.pagemarks[annotationPointer.id];
        });
    }
    onSetPagemarkMode(triggerEvent, mode) {
        log.info("Setting pagemark mode: ", triggerEvent);
    }
}
exports.PagemarkController = PagemarkController;
//# sourceMappingURL=PagemarkController.js.map