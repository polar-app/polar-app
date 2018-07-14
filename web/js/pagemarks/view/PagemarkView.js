const {ThumbnailContainerProvider} = require("../../components/containers/providers/impl/ThumbnailContainerProvider");
const {DefaultContainerProvider} = require("../../components/containers/providers/impl/DefaultContainerProvider");
const {ThumbnailPagemarkComponent} = require("./components/ThumbnailPagemarkComponent");
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

        /***
         * @type {ComponentManager}
         */
        this.primaryPagemarkComponentManager
            = new ComponentManager(model,
                                  new DefaultContainerProvider(),
                                  () => new PrimaryPagemarkComponent(),
                                  () => new PagemarkModel());

        /***
         * @type {ComponentManager}
         */
        this.thumbnailPagemarkComponentManager
            = new ComponentManager(model,
                                   new ThumbnailContainerProvider(),
                                   () => new ThumbnailPagemarkComponent(),
                                   () => new PagemarkModel());


    }

    start() {

        if(this.primaryPagemarkComponentManager)
            this.primaryPagemarkComponentManager.start();

        if(this.thumbnailPagemarkComponentManager)
            this.thumbnailPagemarkComponentManager.start();

    }

}

module.exports.PAGEMARK_VIEW_ENABLED = PAGEMARK_VIEW_ENABLED;
module.exports.PagemarkView = PagemarkView;
