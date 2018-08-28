"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pagemarks_1 = require("../../../metadata/Pagemarks");
const Logger_1 = require("../../../logger/Logger");
const Component_1 = require("../../../components/Component");
const DocFormatFactory_1 = require("../../../docformat/DocFormatFactory");
const AnnotationRects_1 = require("../../../metadata/AnnotationRects");
const PagemarkRect_1 = require("../../../metadata/PagemarkRect");
const Preconditions_1 = require("../../../Preconditions");
const Styles_1 = require("../../../util/Styles");
const Optional_1 = require("../../../util/ts/Optional");
const Rects_1 = require("../../../Rects");
const { BoxController } = require("../../../boxes/controller/BoxController");
const log = Logger_1.Logger.create();
const ENABLE_BOX_CONTROLLER = true;
class AbstractPagemarkComponent extends Component_1.Component {
    constructor(type) {
        super();
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
        this.type = type;
        this.options = {
            templateElement: undefined,
            placementElement: undefined
        };
    }
    init(annotationEvent) {
        this.annotationEvent = annotationEvent;
        this.pagemark = annotationEvent.value;
        this.pagemarkBoxController = new BoxController((boxMoveEvent) => this.onBoxMoved(boxMoveEvent));
    }
    onBoxMoved(boxMoveEvent) {
        console.log("Box moved to: ", boxMoveEvent);
        let annotationRect = AnnotationRects_1.AnnotationRects.createFromPositionedRect(boxMoveEvent.boxRect, boxMoveEvent.restrictionRect);
        let rect = new PagemarkRect_1.PagemarkRect(annotationRect);
        if (boxMoveEvent.state === "completed") {
            log.info("Box move completed.  Updating to trigger persistence.");
            let pagemark = Object.assign({}, this.pagemark);
            pagemark.percentage = rect.toPercentage();
            pagemark.rect = rect;
            let annotationEvent = this.annotationEvent;
            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));
            Pagemarks_1.Pagemarks.updatePagemark(annotationEvent.docMeta, annotationEvent.pageNum, pagemark);
        }
        else {
            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));
        }
        log.info("New pagemarkRect: ", this.pagemark.rect);
    }
    render() {
        let container = this.annotationEvent.container;
        Preconditions_1.Preconditions.assertNotNull(container, "container");
        if (!this.pagemark) {
            throw new Error("Pagemark is required");
        }
        if (!this.pagemark.percentage) {
            throw new Error("Pagemark has no percentage");
        }
        let templateElement = this.options.templateElement;
        let placementElement = this.options.placementElement;
        if (!templateElement) {
            templateElement = container.element;
        }
        if (!placementElement) {
            placementElement = container.element.querySelector(".canvasWrapper, .iframeWrapper");
            log.warn("Using a default placementElement from selector: ", placementElement);
        }
        Preconditions_1.Preconditions.assertNotNull(templateElement, "templateElement");
        Preconditions_1.Preconditions.assertNotNull(placementElement, "placementElement");
        console.log("Using templateElement: ", templateElement);
        console.log("Using placementElement: ", placementElement);
        let id = this.createID();
        let pagemarkElement = document.getElementById(id);
        if (pagemarkElement === null) {
            pagemarkElement = document.createElement("div");
            pagemarkElement.setAttribute("id", id);
            placementElement.parentElement.insertBefore(pagemarkElement, placementElement);
            if (ENABLE_BOX_CONTROLLER) {
                console.log("Creating box controller for pagemarkElement: ", pagemarkElement);
                this.pagemarkBoxController.register({
                    target: pagemarkElement,
                    restrictionElement: placementElement,
                    intersectedElementsSelector: ".pagemark"
                });
            }
        }
        let annotationEvent = this.annotationEvent;
        pagemarkElement.setAttribute("data-pagemark-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-type", "pagemark");
        pagemarkElement.setAttribute("data-annotation-doc-fingerprint", annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-annotation-page-num", `${annotationEvent.pageMeta.pageInfo.num}`);
        pagemarkElement.setAttribute("data-type", "pagemark");
        pagemarkElement.setAttribute("data-doc-fingerprint", annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-page-num", `${annotationEvent.pageMeta.pageInfo.num}`);
        pagemarkElement.className = "pagemark annotation";
        pagemarkElement.style.backgroundColor = "#00CCFF";
        pagemarkElement.style.opacity = "0.3";
        pagemarkElement.style.position = "absolute";
        let placementRect = this.createPlacementRect(placementElement);
        let pagemarkRect = this.toOverlayRect(placementRect, this.pagemark);
        pagemarkElement.style.left = `${pagemarkRect.left}px`;
        pagemarkElement.style.top = `${pagemarkRect.top}px`;
        pagemarkElement.style.width = `${pagemarkRect.width}px`;
        pagemarkElement.style.height = `${pagemarkRect.height}px`;
        pagemarkElement.style.zIndex = '9';
    }
    destroy() {
        let pagemarkElement = document.getElementById(this.createID());
        if (pagemarkElement) {
            if (pagemarkElement.parentElement) {
                pagemarkElement.parentElement.removeChild(pagemarkElement);
            }
        }
    }
    createPlacementRect(placementElement) {
        let positioning = Styles_1.Styles.positioning(placementElement);
        let positioningPX = Styles_1.Styles.positioningToPX(positioning);
        let result = {
            left: Optional_1.Optional.of(positioningPX.left).getOrElse(placementElement.offsetLeft),
            top: Optional_1.Optional.of(positioningPX.top).getOrElse(placementElement.offsetTop),
            width: Optional_1.Optional.of(positioningPX.width).getOrElse(placementElement.offsetWidth),
            height: Optional_1.Optional.of(positioningPX.height).getOrElse(placementElement.offsetHeight),
        };
        return Rects_1.Rects.createFromBasicRect(result);
    }
    createID() {
        return `${this.type}-pagemark-${this.pagemark.id}`;
    }
    toOverlayRect(placementRect, pagemark) {
        let pagemarkRect = new PagemarkRect_1.PagemarkRect(pagemark.rect);
        let overlayRect = pagemarkRect.toDimensions(placementRect.dimensions);
        return Rects_1.Rects.createFromBasicRect({
            left: overlayRect.left + placementRect.left,
            top: overlayRect.top + placementRect.top,
            width: overlayRect.width,
            height: overlayRect.height,
        });
    }
}
exports.AbstractPagemarkComponent = AbstractPagemarkComponent;
;
//# sourceMappingURL=AbstractPagemarkComponent.js.map