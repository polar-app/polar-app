const {PrimaryPagemarkComponent} = require("./components/PrimaryPagemarkComponent");
const {ComponentManager} = require("../../components/ComponentManager");
const {PagemarkModel} = require("../model/PagemarkModel");

const PAGEMARK_VIEW_ENABLED = true;

class PagemarkView {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {

        // right now we're only doing the primary pagemark.. add thumbnails
        // in the future.
        this.componentManager = new ComponentManager(model,
            () => new PrimaryPagemarkComponent(),
            () => new PagemarkModel());

    }

    start() {
        this.componentManager.start();
    }

}

module.exports.PAGEMARK_VIEW_ENABLED = PAGEMARK_VIEW_ENABLED;
module.exports.PagemarkView = PagemarkView;
