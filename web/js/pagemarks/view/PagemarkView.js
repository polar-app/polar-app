const {PagemarkModel} = require("../model/PagemarkModel");
const {Logger} = require("../../logger/Logger");

const log = Logger.create();

class PagemarkView {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {
        this.model = model;
    }

    start() {
        this.model.registerListenerForDocumentLoaded(documentLoadedEvent => this.onDocumentLoaded(documentLoadedEvent));
    }

    onDocumentLoaded(documentLoadedEvent) {

        log.info("PagemarkView.onDocumentLoaded");

        let pagemarkModel = new PagemarkModel();

        pagemarkModel.registerListener(documentLoadedEvent.docMeta, pagemarkEvent => this.onPagemark(pagemarkEvent));

    }

    onPagemark(pagemarkEvent) {

        log.info("Got pagemark event!", pagemarkEvent);

    }

}

module.exports.PagemarkView = PagemarkView;
