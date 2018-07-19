const log = require("../../logger/Logger").create();
const {DocFormatFactory} = require("../../docformat/DocFormatFactory");
const {Rects} = require("../../Rects");
const {Pagemarks} = require("../../metadata/Pagemarks");
const {PagemarkRects} = require("../../metadata/PagemarkRects");

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
        console.log("Creating pagemarks: ", data);

        let elements = document.elementsFromPoint(data.points.client.x, data.points.client.y);

        elements = elements.filter(element => element.matches(".page"));

        if(elements.length === 1) {

            let pageElement = elements[0];

            log.info("Creating pagemark on pageElement: ", pageElement);

            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            let pageElementPoint = this.getRelativePoint(pageElement, data.points.page);

            let boxRect = Rects.createFromBasicRect({
                left: pageElementPoint.x,
                top: pageElementPoint.y,
                width: 150,
                height: 150
            });

            log.info("Placing pagemark at: ", boxRect);

            let containerRect = Rects.createFromOffset(pageElement);

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

    getRelativePoint(element, point) {

        let rect = element.getBoundingClientRect();

        return {
            x: point.x - rect.left,
            y: point.y - rect.top
        };

    }

}

module.exports.PagemarkController = PagemarkController;
