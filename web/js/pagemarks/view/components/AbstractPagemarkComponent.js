const {PagemarkRect} = require("../../../metadata/PagemarkRect");
const {AnnotationRects} = require("../../../metadata/AnnotationRects");
const {PagemarkRects} = require("../../../metadata/PagemarkRects");
const {Component} = require("../../../components/Component");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");
const {Styles} = require("../../../util/Styles");
const {Preconditions} = require("../../../Preconditions");
const {BoxController} = require("../../../boxes/controller/BoxController");
const {Rects} = require("../../../Rects");
const {Optional} = require("../../../Optional");
const log = require("../../../logger/Logger").create();

const ENABLE_BOX_CONTROLLER = true;

class AbstractPagemarkComponent extends Component {

    constructor(type) {
        super();

        /**
         * The type of the pagemark (primary or thumbnail)
         */
        this.type = type;

        /**
         *
         * @type {DocFormat}
         */
        this.docFormat = DocFormatFactory.getInstance();

        /**
         *
         * @type {Pagemark}
         */
        this.pagemark = undefined;

        /**
         *
         * @type {AnnotationEvent}
         */
        this.annotationEvent = undefined;

        /**
         *
         * @type {BoxController}
         */
        this.pagemarkBoxController = undefined;

        this.options = {
            templateElement: null,
            placementElement: null
        };

    }

    /**
     * @Override
     * @param annotationEvent {AnnotationEvent}
     */
    init(annotationEvent) {

        this.annotationEvent = annotationEvent;
        this.pagemark = annotationEvent.value;

        this.pagemarkBoxController = new BoxController(boxMoveEvent => this.onBoxMoved(boxMoveEvent));

    }

    /**
     *
     * @param boxMoveEvent {BoxMoveEvent}
     */
    onBoxMoved(boxMoveEvent) {

        // TODO: actually I think this belongs in the controller... not the view
        //
        //

        // TODO: remove the pagemark, then recreate it...

        console.log("Box moved to: ", boxMoveEvent);

        // boxRect, containerRect, pageRect...

        let annotationRect = AnnotationRects.createFromPositionedRect(boxMoveEvent.boxRect,
                                                                      boxMoveEvent.restrictionRect);

        let rect = new PagemarkRect(annotationRect);

        // FIXME: the lastUpdated here isn't being updated. I'm going to
        // have to change the setters I think..

        if (boxMoveEvent.state === "completed") {

            log.info("Box move completed.  Updating to trigger persistence.")

            let pagemark = Object.assign({}, this.pagemark);
            pagemark.percentage = rect.toPercentage();
            pagemark.rect = rect;

            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));

            this.annotationEvent.pageMeta.pagemarks[pagemark.id] = pagemark;

        } else {

            //this.pagemark.percentage = rect.toPercentage();
            //this.pagemark.rect = rect;

            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));

        }

        log.info("New pagemarkRect: ", this.pagemark.rect);

    }

    /**
     * @Override
     *
     */
    render() {

        // TODO: placemenElement should be called containerElement

        // TODO: we should have pagemarkRect and positionedPagemarkRect too

        // TODO: see of templateElement and placementElement are always the
        //       same now.  They might be.

        //
        // - the options building can't be reliably tested
        //
        // - there are too many ways to compute the options
        //
        // - we PLACE the element as part of this function.  Have a secondary
        //   way to just CREATE the element so that we can test the settings
        //   properly.

        let container = this.annotationEvent.container;
        Preconditions.assertNotNull(container, "container");

        if(! this.pagemark) {
            throw new Error("Pagemark is required");
        }

        if(! this.pagemark.percentage) {
            throw new Error("Pagemark has no percentage");
        }

        let templateElement = this.options.templateElement;
        let placementElement = this.options.placementElement;

        if(! templateElement) {
            templateElement = container.element;
        }

        if (! placementElement) {
            // TODO: move this to the proper component
            placementElement = container.element.querySelector(".canvasWrapper, .iframeWrapper");
            // TODO: we need to code this directly into the caller
            log.warn("Using a default placementElement from selector: ", placementElement);
        }

        Preconditions.assertNotNull(templateElement, "templateElement");
        Preconditions.assertNotNull(placementElement, "placementElement");

        console.log("Using templateElement: ", templateElement);
        console.log("Using placementElement: ", placementElement);

        // a unique ID in the DOM for this element.
        let id = this.createID();

        let pagemarkElement = document.getElementById(id);

        if(pagemarkElement === null ) {
            // only create the pagemark if it's missing.
            pagemarkElement = document.createElement("div");
            pagemarkElement.setAttribute("id", id);

            placementElement.parentElement.insertBefore(pagemarkElement, placementElement);

            if(ENABLE_BOX_CONTROLLER) {
                console.log("Creating box controller for pagemarkElement: ", pagemarkElement);
                this.pagemarkBoxController.register({
                    target: pagemarkElement,
                    restrictionElement: placementElement,
                    intersectedElementsSelector: ".pagemark"
                });
            }

        }

        // set a pagemark-id in the DOM so that we can work with it when we use
        // the context menu, etc.
        // TODO: this is duplicated code across three places.. all major
        // annotation components.
        pagemarkElement.setAttribute("data-pagemark-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-type", "pagemark");
        pagemarkElement.setAttribute("data-annotation-doc-fingerprint", this.annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-annotation-page-num", `${this.annotationEvent.pageMeta.pageInfo.num}`);


        pagemarkElement.setAttribute("data-type", "pagemark");
        pagemarkElement.setAttribute("data-doc-fingerprint", this.annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-page-num", `${this.annotationEvent.pageMeta.pageInfo.num}`);


        // make sure we have a reliable CSS classname to work with.
        pagemarkElement.className="pagemark annotation";

        //pagemark.style.backgroundColor="rgb(198, 198, 198)";
        pagemarkElement.style.backgroundColor="#00CCFF";
        pagemarkElement.style.opacity="0.3";

        pagemarkElement.style.position="absolute";

        // TODO: we don't actually need the placement rect.. just the dimensions
        // of the container.
        let placementRect = this.createPlacementRect(placementElement);
        let pagemarkRect = this.toOverlayRect(placementRect, this.pagemark);

        // TODO: what I need is a generic way to cover an element and place
        // something on top of it no matter what positioning strategy it uses.

        pagemarkElement.style.left = `${pagemarkRect.left}px`;
        pagemarkElement.style.top = `${pagemarkRect.top}px`;
        pagemarkElement.style.width = `${pagemarkRect.width}px`;
        pagemarkElement.style.height = `${pagemarkRect.height}px`;
        pagemarkElement.style.zIndex = '9';

    }

    /**
     * @Override
     * @returns {*}
     */
    destroy() {

        let pagemarkElement = document.getElementById(this.createID());

        if(pagemarkElement) {

            if(pagemarkElement.parentElement) {
                pagemarkElement.parentElement.removeChild(pagemarkElement);
            }

        }

    }

    createPlacementRect(placementElement) {

        let positioning = Styles.positioning(placementElement);
        positioning = Styles.positioningToPX(positioning);

        // TODO: this could be cleaned up a bit...

        let result = {
            left: Optional.of(positioning.left).getOrElse(placementElement.offsetLeft),
            top: Optional.of(positioning.top).getOrElse(placementElement.offsetTop),
            width: Optional.of(positioning.width).getOrElse(placementElement.offsetWidth),
            height: Optional.of(positioning.height).getOrElse(placementElement.offsetHeight),
        };

        return Rects.createFromBasicRect(result);

    }

    /**
     * Create a unique DOM ID for this pagemark.
     */
    createID() {
        return `${this.type}-pagemark-${this.pagemark.id}`;
    }

    // FIXME: I have to improve this grammar... placement, positioned, etc..
    // which one is which.

    /**
     *
     * @param placementRect {Rect}
     * @param pagemark {Pagemark}
     * @return {Rect}
     */
    toOverlayRect(placementRect, pagemark) {
        let pagemarkRect = new PagemarkRect(pagemark.rect);

        let overlayRect = pagemarkRect.toDimensions(placementRect.dimensions);

        // we have to apply the original placementRect top and left so it's
        // placed as a proper overlay
        return Rects.createFromBasicRect({
            left: overlayRect.left + placementRect.left,
            top: overlayRect.top + placementRect.top,
            width: overlayRect.width,
            height: overlayRect.height,
        });

    }

}

module.exports.AbstractPagemarkComponent = AbstractPagemarkComponent;
