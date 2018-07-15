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
        console.log("Creating pagemark.");

        // FIXME: The point is based on the viewport I think.

        let elements = document.elementsFromPoint(data.point.x, data.point.y);

        elements = elements.filter(element => element.matches(".page"));

        if(elements.length === 1) {

            let pageElement = elements[0];

            log.info("Creating pagemark on pageElement: ", pageElement);

            let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

            let boxRect = Rects.createFromBasicRect({
                left: data.point.x,
                top: data.point.y,
                width: 30,
                height: 30
            });

            let containerRect = Rects.createFromOffset(pageElement);

            let pagemarkRect = PagemarkRects.createFromPositionedRect(boxRect, containerRect);

            let pagemark = Pagemarks.create({rect: pagemarkRect});

            this.model.docMeta.getPageMeta(pageNum).pagemarks[pagemark.id] = pagemark;

            log.info("Using pagemarkRect: ", pagemarkRect);

            // update the DocMeta with a pagemark on this page..

        } else {
            log.warn("No .page element clicked.");
        }

    }

}

module.exports.PagemarkController = PagemarkController;
