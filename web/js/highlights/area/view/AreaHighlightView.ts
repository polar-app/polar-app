const {DefaultContainerProvider} = require("../../../components/containers/providers/impl/DefaultContainerProvider");
const {AreaHighlightComponent} = require("./components/AreaHighlightComponent");
const {ComponentManager} = require("../../../components/ComponentManager");
const {AreaHighlightModel} = require("../model/AreaHighlightModel");

class AreaHighlightView {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {

        this.componentManager = new ComponentManager(model,
                                                     new DefaultContainerProvider(),
                                                     () => new AreaHighlightComponent(),
                                                     () => new AreaHighlightModel());

    }

    start() {
        this.componentManager.start();
    }

}

module.exports.AreaHighlightView = AreaHighlightView;
