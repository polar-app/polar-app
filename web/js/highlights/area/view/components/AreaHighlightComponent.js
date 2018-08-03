const {DocFormatFactory} = require("../../../../docformat/DocFormatFactory");
const {Component} = require("../../../../components/Component");
const {forDict} = require("../../../../util/Functions");
const {Rects} = require("../../../../Rects");
const {Dimensions} = require("../../../../util/Dimensions");
const {AreaHighlight} = require("../../../../metadata/AreaHighlight");
const {AreaHighlights} = require("../../../../metadata/AreaHighlights");
const {AnnotationRect} = require("../../../../metadata/AnnotationRect");
const {AnnotationRects} = require("../../../../metadata/AnnotationRects");
const {AreaHighlightRect} = require("../../../../metadata/AreaHighlightRect");
const {AreaHighlightRects} = require("../../../../metadata/AreaHighlightRects");
const {BoxController} = require("../../../../boxes/controller/BoxController");
const {BoxOptions} = require("../../../../boxes/controller/BoxOptions");

const log = require("../../../../logger/Logger").create();

class AreaHighlightComponent extends Component {

    constructor() {
        super();

        /**
         *
         * @type {DocFormat}
         */
        this.docFormat = DocFormatFactory.getInstance();

        /**
         *
         * @type {AnnotationEvent}
         */
        this.annotationEvent = undefined;

        /**
         *
         * @type {AreaHighlight}
         */
        this.areaHighlight = undefined;

        /**
         *
         * @type {BoxController}
         */
        this.boxController = undefined;

    }

    /**
     * @Override
     * @param annotationEvent
     */
    init(annotationEvent) {

        // TODO: we should a specific event class for this data which is captured
        // within a higher level annotationEvent.
        this.annotationEvent = annotationEvent;
        this.areaHighlight = annotationEvent.value;

        this.boxController = new BoxController(boxMoveEvent => this.onBoxMoved(boxMoveEvent));

    }

    /**
     *
     * @param boxMoveEvent {BoxMoveEvent}
     */
    onBoxMoved(boxMoveEvent) {

        // TODO: actually I think this belongs in the controller... not the view

        // TODO: refactor / this code is shared with the AbstractPagemarkComponent

        console.log("Box moved to: ", boxMoveEvent);

        let annotationRect = AnnotationRects.createFromPositionedRect(boxMoveEvent.boxRect,
                                                                      boxMoveEvent.restrictionRect);

        let areaHighlightRect = new AreaHighlightRect(annotationRect);

        // FIXME: the lastUpdated here isn't being updated. I'm going to
        // have to change the setters I think..

        if (boxMoveEvent.state === "completed") {

            // TODO: this isn't handled properly because we create a NEW rect with the existing values...

            this.areaHighlight = new AreaHighlight(this.areaHighlight);
            this.areaHighlight.rects["0"] = areaHighlightRect;

            log.info("New areaHighlight: ", JSON.stringify(this.areaHighlight, null, "  "));

            delete this.annotationEvent.pageMeta.areaHighlights[this.areaHighlight.id];
            this.annotationEvent.pageMeta.areaHighlights[this.areaHighlight.id] = this.areaHighlight;

        } else {

        }

    }

    /**
     * @Override
     */
    render() {

        this.destroy();

        log.info("render()");

        let docMeta = this.annotationEvent.docMeta;
        let pageMeta = this.annotationEvent.pageMeta;
        let docInfo = docMeta.docInfo;

        let pageElement = this.docFormat.getPageElementFromPageNum(pageMeta.pageInfo.num);
        let dimensionsElement = pageElement.querySelector(".canvasWrapper, .iframeWrapper");

        // the container must ALWAYS be the pageElement because if we use any
        // other container PDF.js breaks.
        let containerElement = pageElement;

        let pageDimensions = new Dimensions({
            width: dimensionsElement.clientWidth,
            height: dimensionsElement.clientHeight
        });

        forDict(this.areaHighlight.rects, (key, rect) => {

            let areaHighlightRect = AreaHighlightRects.createFromRect(rect);

            let overlayRect = areaHighlightRect.toDimensions(pageDimensions);

            log.info("Rendering annotation at: " + JSON.stringify(overlayRect, null, "  "));

            let id = this.createID();

            let highlightElement = document.getElementById(id);

            if(highlightElement === null ) {

                // only create the pagemark if it's missing.
                highlightElement = document.createElement("div");
                highlightElement.setAttribute("id", id);

                containerElement.insertBefore(highlightElement, containerElement.firstChild);

                log.info("Creating box controller for highlightElement: ", highlightElement);

                this.boxController.register(new BoxOptions({
                    target: highlightElement,
                    restrictionElement: dimensionsElement,
                    intersectedElementsSelector: ".area-highlight"
                }));

            }

            // TODO: a lot of this code is shared with pagemarks.

            highlightElement.setAttribute("data-type", "area-highlight");
            highlightElement.setAttribute("data-doc-fingerprint", docInfo.fingerprint);
            highlightElement.setAttribute("data-area-highlight-id", this.areaHighlight.id);
            highlightElement.setAttribute("data-annotation-id", this.areaHighlight.id);
            highlightElement.setAttribute("data-page-num", `${pageMeta.pageInfo.num}`);

            // annotation descriptor metadata.
            highlightElement.setAttribute("data-annotation-type", "area-highlight");
            highlightElement.setAttribute("data-annotation-id", this.areaHighlight.id);
            highlightElement.setAttribute("data-annotation-page-num", `${pageMeta.pageInfo.num}`);
            highlightElement.setAttribute("data-annotation-doc-fingerprint", docInfo.fingerprint);

            highlightElement.className = `area-highlight annotation area-highlight-${this.areaHighlight.id}`;

            highlightElement.style.position = "absolute";
            highlightElement.style.backgroundColor = `yellow`;
            highlightElement.style.opacity = `0.5`;

            // if(this.docFormat.name === "pdf") {
            //     // this is only needed for PDF and we might be able to use a transform
            //     // in the future which would be easier.
            //     let currentScale = this.docFormat.currentScale();
            //     overlayRect = Rects.scale(overlayRect, currentScale);
            // }

            highlightElement.style.left = `${overlayRect.left}px`;
            highlightElement.style.top = `${overlayRect.top}px`;

            highlightElement.style.width = `${overlayRect.width}px`;
            highlightElement.style.height = `${overlayRect.height}px`;

            highlightElement.style.border = `1px solid #c6c6c6`;

            highlightElement.style.zIndex = '1';

        });

    }

    /**
     * Create a unique DOM ID for this pagemark.
     */
    createID() {
        return `area-highlight-${this.areaHighlight.id}`;
    }

    /**
     * @Override
     */
    destroy() {

        let selector = `.area-highlight-${this.areaHighlight.id}`;
        let elements = document.querySelectorAll(selector);

        log.info(`Found N elements for selector ${selector}: ` + elements.length);

        elements.forEach(highlightElement => {
            highlightElement.parentElement.removeChild(highlightElement);
        });

    }

}

module.exports.AreaHighlightComponent = AreaHighlightComponent;
