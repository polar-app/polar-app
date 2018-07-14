const {PrimaryPagemarkComponent} = require("./components/PrimaryPagemarkComponent");
const {ComponentManager} = require("../../components/ComponentManager");
const {PagemarkModel} = require("../model/PagemarkModel");

class PagemarkView {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {

        this.componentManager = new ComponentManager(model,
            () => new PrimaryPagemarkComponent(),
            () => new PagemarkModel());

    }

    start() {
        this.componentManager.start();
    }

}

module.exports.PagemarkView = PagemarkView;
