const $ = require('jquery');

const {KeyEvents} = require("../../KeyEvents.js");
const {Elements} = require("../../util/Elements");
const {DocFormatFactory} = require("../../docformat/DocFormatFactory");
const log = require("../../logger/Logger").create();

class PagemarkCoverageEventListener {

    /**
     * @param controller {WebController}
     * @param model {Model}
     */
    constructor(controller, model) {
        this.controller = controller;
        this.model = model;
        this.keyActivated = false;
        this.docFormat = DocFormatFactory.getInstance();
    }

    start() {

        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

    }

    onDocumentLoaded() {

        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));

        document.querySelectorAll(".page").forEach(pageElement => {
            pageElement.addEventListener("click", this.mouseListener.bind(this));
        });

    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event) {

        if(!event) {
            throw new Error("no event");
        }

        this.keyActivated = KeyEvents.isKeyMetaActive(event);

    }

    async mouseListener(event) {

        if(!event) {
            throw new Error("no event");
        }

        if(!this.keyActivated) {
            return;
        }

        await this.onActivated(event);

    }

    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    async onActivated(event) {

        let pageElement = Elements.untilRoot(event.target, ".page");

        let height = pageElement.clientHeight;

        let percentage = (event.offsetY / height) * 100;

        log.info("percentage: ", percentage);

        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
        this.controller.erasePagemark(pageNum);
        await this.controller.createPagemark(pageNum, {percentage});

    }

}

module.exports.PagemarkCoverageEventListener = PagemarkCoverageEventListener;
