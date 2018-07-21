const log = require("../../logger/Logger").create();
const {DocFormatFactory} = require("../../docformat/DocFormatFactory");
const {Rects} = require("../../Rects");
const {Pagemarks} = require("../../metadata/Pagemarks");
const {PagemarkRects} = require("../../metadata/PagemarkRects");
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

        if(event.data && event.data.type === "create-pagemark") {
            this.onCreatePagemark(event.data);
        }

    }

    onCreatePagemark(data) {

        // convert the point on the page to a pagemark and then save it into
        // the model/docMeta... the view will do the rest.

        let elements = document.elementsFromPoint(data.points.client.x, data.points.client.y);

        elements = elements.filter(element => element.matches(".page"));

        if(elements.length === 1) {

            let pageElement = elements[0];

            log.info("Creating pagemark on pageElement: ", pageElement);

            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            // FIXME: this is wrong... we're getting the offset from the target
            // and since we're called from the context menu we have no fucking
            // idea where we are now.

            // get the point within the element itself..
            let pageElementPoint = data.points.pageOffset;

            let boxRect = Rects.createFromBasicRect({
                left: pageElementPoint.x,
                top: pageElementPoint.y,
                width: 150,
                height: 150
            });

            log.info("Placing pagemark at: ", boxRect);

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

            // TODO: do we somehow need to focus the new pagemark.

            // update the DocMeta with a pagemark on this page..

        } else {
            log.warn("Wrong number of elements selected: " + elements.length);
        }

    }

}

module.exports.PagemarkController = PagemarkController;
