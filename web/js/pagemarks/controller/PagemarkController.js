const log = require("../../logger/Logger").create();
const {DocFormatFactory} = require("../../docformat/DocFormatFactory");
const {Rects} = require("../../Rects");
const {Pagemarks} = require("../../metadata/Pagemarks");
const {PagemarkRects} = require("../../metadata/PagemarkRects");
const {AnnotationPointers} = require("../../annotations/AnnotationPointers");
const {Elements} = require("../../util/Elements");

class PagemarkController {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {
        this.model = model;
        this.docFormat = DocFormatFactory.getInstance();
    }

    start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    onMessageReceived(event) {

        let contextMenuEvent = event.data;

        if(event.data && event.data.type === "create-pagemark") {
            this.onCreatePagemark(contextMenuEvent);
        }

        if (event.data && event.data.type === "delete-pagemark") {
            this.onDeletePagemark(contextMenuEvent);
        }

    }

    onCreatePagemark(data) {

        // convert the point on the page and then save it into the
        // model/docMeta... the view will do the rest.

        // FIXME migrate this to AnnotationRects now as this shares a lot of code
        // here...

        let elements = document.elementsFromPoint(data.points.client.x, data.points.client.y);

        elements = elements.filter(element => element.matches(".page"));

        if(elements.length === 1) {

            let pageElement = elements[0];

            log.info("Creating box on pageElement: ", pageElement);

            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            // get the point within the element itself..
            let pageElementPoint = data.points.pageOffset;

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


    onDeletePagemark(contextMenuEvent) {

        console.log("FIXME handling onDeletePagemark: " , contextMenuEvent)

        let annotationPointers
            = AnnotationPointers.toAnnotationPointers(".pagemark", contextMenuEvent);

        annotationPointers.forEach(annotationPointer => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationPointer.pageNum);
            delete pageMeta.pagemarks[annotationPointer.id];
        });

    }

}

module.exports.PagemarkController = PagemarkController;
