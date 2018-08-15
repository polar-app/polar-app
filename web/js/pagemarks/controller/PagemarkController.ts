import {Model} from '../../Model';
import {DocFormatFactory} from '../../docformat/DocFormatFactory';
import {DocFormat} from '../../docformat/DocFormat';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {AnnotationPointers} from '../../annotations/AnnotationPointers';
import {Logger} from '../../logger/Logger';
import {Pagemarks} from '../../metadata/Pagemarks';
import {PagemarkRects} from '../../metadata/PagemarkRects';
import {PagemarkMode} from '../../metadata/PagemarkMode';

const {Rects} = require("../../Rects");

const log = Logger.create();

export class PagemarkController {

    private model: Model;

    private docFormat: DocFormat;

    /**
     *
     * @param model {Model}
     */
    constructor(model: Model) {
        this.model = model;
        this.docFormat = DocFormatFactory.getInstance();
    }

    start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    onMessageReceived(event: any) {

        log.info("Received message: ", event);

        let triggerEvent = event.data;

        switch(event.data.type) {

            case "create-pagemark":
                this.onCreatePagemark(triggerEvent);
                break;

            case "delete-pagemark":
                this.onDeletePagemark(triggerEvent);
                break;

            case "set-pagemark-mode-read":
                this.onSetPagemarkMode(triggerEvent, PagemarkMode.READ);
                break;

            case "set-pagemark-mode-ignored":
                this.onSetPagemarkMode(triggerEvent, PagemarkMode.IGNORED);
                break;


        }

    }

    onCreatePagemark(triggerEvent: TriggerEvent) {

        // convert the point on the page and then save it into the
        // model/docMeta... the view will do the rest.

        // FIXME migrate this to AnnotationRects now as this shares a lot of code
        // here...

        let elements = document.elementsFromPoint(triggerEvent.points.client.x, triggerEvent.points.client.y);

        elements = elements.filter(element => element.matches(".page"));

        if(elements.length === 1) {

            let pageElement = <HTMLElement>elements[0];

            log.info("Creating box on pageElement: ", pageElement);

            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            // get the point within the element itself..
            let pageElementPoint = triggerEvent.points.pageOffset;

            let boxRect = Rects.createFromBasicRect({
                left: pageElementPoint.x,
                top: pageElementPoint.y,
                width: 150,
                height: 150
            });

            log.info("Placing box at: ", boxRect);

            // get a rect for the element... we really only need the dimensions
            // though.. not the width and height.
            let containerRect = Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: pageElement.offsetWidth,
                height: pageElement.offsetHeight
            });

            let pagemarkRect = PagemarkRects.createFromPositionedRect(boxRect, containerRect);

            let pagemark = Pagemarks.create({rect: pagemarkRect});

            this.model.docMeta.getPageMeta(pageNum).pagemarks[pagemark.id] = pagemark;

            log.info("Using pagemarkRect: ", pagemarkRect);

            // TODO: do we somehow need to focus the new pagemark...

            // the only way to do this is to wait until the component is added
            // to the DOM and I think we can do this by adding an event
            // listener that just fires once and then call focus() on the
            // element.

            // update the DocMeta with a pagemark on this page..

        } else {
            log.warn("Wrong number of elements selected: " + elements.length);
        }

    }

    onDeletePagemark(triggerEvent: TriggerEvent) {

        log.info("Deleting pagemark: ", triggerEvent);

        let annotationPointers
            = AnnotationPointers.toAnnotationPointers(".pagemark", triggerEvent);

        log.info("Working with annotationPointers: ", annotationPointers);

        annotationPointers.forEach(annotationPointer => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationPointer.pageNum);
            delete pageMeta.pagemarks[annotationPointer.id];
        });

    }

    onSetPagemarkMode(triggerEvent: TriggerEvent, mode: PagemarkMode) {
        log.info("Setting pagemark mode: ", triggerEvent);

    }

}
