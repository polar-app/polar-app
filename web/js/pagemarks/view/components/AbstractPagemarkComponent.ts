import {Pagemarks} from "../../../metadata/Pagemarks";
import {Logger} from '../../../logger/Logger';
import {Component} from '../../../components/Component';
import {DocFormatFactory} from '../../../docformat/DocFormatFactory';
import {DocFormat} from '../../../docformat/DocFormat';
import {AnnotationEvent} from '../../../annotations/components/AnnotationEvent';
import {Pagemark} from '../../../metadata/Pagemark';
import {AnnotationRects} from '../../../metadata/AnnotationRects';
import {PagemarkRect} from '../../../metadata/PagemarkRect';
import {Preconditions} from '../../../Preconditions';
import {Styles} from '../../../util/Styles';
import {Optional} from '../../../util/ts/Optional';
import {Rects} from '../../../Rects';
import {Rect} from '../../../Rect';
import {BoxController} from "../../../boxes/controller/BoxController";

const log = Logger.create();

const ENABLE_BOX_CONTROLLER = true;

export class AbstractPagemarkComponent extends Component {

    /**
     * The type of the pagemark (primary or thumbnail)
     */
    private readonly type: PagemarkComponentType;

    private readonly docFormat: DocFormat;

    private pagemark?: Pagemark;

    private annotationEvent?: AnnotationEvent;

    private pagemarkBoxController: any;

    protected options: ElementOptions;

    constructor(type: PagemarkComponentType) {
        super();

        this.docFormat = DocFormatFactory.getInstance();

        this.type = type;

        this.options = {
            templateElement: undefined,
            placementElement: undefined
        };

    }

    /**
     * @Override
     */
    init(annotationEvent: AnnotationEvent) {

        this.annotationEvent = annotationEvent;
        this.pagemark = annotationEvent.value;

        this.pagemarkBoxController = new BoxController((boxMoveEvent: any) => this.onBoxMoved(boxMoveEvent));

    }

    /**
     *
     * @param boxMoveEvent {BoxMoveEvent}
     */
    onBoxMoved(boxMoveEvent: any) {

        // TODO: actually I think this belongs in the controller... not the view
        //
        //

        // TODO: remove the pagemark, then recreate it...

        log.info("Box moved to: ", boxMoveEvent);

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

            let annotationEvent = this.annotationEvent!;

            let pageNum = annotationEvent.pageMeta.pageInfo.num;

            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));
            Pagemarks.updatePagemark(annotationEvent.docMeta, pageNum, pagemark);

        } else {

            //this.pagemark.percentage = rect.toPercentage();
            //this.pagemark.rect = rect;

            log.info("New pagemark: ", JSON.stringify(this.pagemark, null, "  "));

        }

        log.info("New pagemarkRect: ", this.pagemark!.rect);

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

        let container = this.annotationEvent!.container;
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
            placementElement = <HTMLElement>container.element.querySelector(".canvasWrapper, .iframeWrapper");
            // TODO: we need to code this directly into the caller
            log.warn("Using a default placementElement from selector: ", placementElement);
        }

        Preconditions.assertNotNull(templateElement, "templateElement");
        Preconditions.assertNotNull(placementElement, "placementElement");

        log.info("Using templateElement: ", templateElement);
        log.info("Using placementElement: ", placementElement);

        // a unique ID in the DOM for this element.
        let id = this.createID();

        let pagemarkElement = document.getElementById(id);

        if(pagemarkElement === null ) {
            // only create the pagemark if it's missing.
            pagemarkElement = document.createElement("div");
            pagemarkElement.setAttribute("id", id);

            placementElement.parentElement!.insertBefore(pagemarkElement, placementElement);

            if(ENABLE_BOX_CONTROLLER) {
                log.info("Creating box controller for pagemarkElement: ", pagemarkElement);
                this.pagemarkBoxController.register({
                    target: pagemarkElement,
                    restrictionElement: placementElement,
                    intersectedElementsSelector: ".pagemark"
                });
            }

        }

        let annotationEvent = this.annotationEvent!;

        // set a pagemark-id in the DOM so that we can work with it when we use
        // the context menu, etc.
        // TODO: this is duplicated code across three places.. all major
        // annotation components.
        pagemarkElement.setAttribute("data-pagemark-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-id", this.pagemark.id);
        pagemarkElement.setAttribute("data-annotation-type", "pagemark");
        pagemarkElement.setAttribute("data-annotation-doc-fingerprint", annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-annotation-page-num", `${annotationEvent.pageMeta.pageInfo.num}`);


        pagemarkElement.setAttribute("data-type", "pagemark");
        pagemarkElement.setAttribute("data-doc-fingerprint", annotationEvent.docMeta.docInfo.fingerprint);
        pagemarkElement.setAttribute("data-page-num", `${annotationEvent.pageMeta.pageInfo.num}`);


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

    createPlacementRect(placementElement: HTMLElement) {

        let positioning = Styles.positioning(placementElement);
        let positioningPX = Styles.positioningToPX(positioning);

        // TODO: this could be cleaned up a bit...

        let result = {
            left: Optional.of(positioningPX.left).getOrElse(placementElement.offsetLeft),
            top: Optional.of(positioningPX.top).getOrElse(placementElement.offsetTop),
            width: Optional.of(positioningPX.width).getOrElse(placementElement.offsetWidth),
            height: Optional.of(positioningPX.height).getOrElse(placementElement.offsetHeight),
        };

        return Rects.createFromBasicRect(result);

    }

    /**
     * Create a unique DOM ID for this pagemark.
     */
    createID() {
        return `${this.type}-pagemark-${this.pagemark!.id}`;
    }

    // FIXME: I have to improve this grammar... placement, positioned, etc..
    // which one is which.

    toOverlayRect(placementRect: Rect, pagemark: Pagemark) {
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

export interface ElementOptions {
    templateElement?: HTMLElement,
    placementElement?: HTMLElement
};


type PagemarkComponentType = 'primary' | 'thumbnail';
