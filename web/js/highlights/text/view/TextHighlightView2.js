const {TextHighlightComponent} = require("./components/TextHighlightComponent");
const {ComponentManager} = require("../../../components/ComponentManager");
const {TextHighlightModel} = require("../model/TextHighlightModel");

class TextHighlightView2 {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {

        this.componentManager = new ComponentManager(model,
                                                     () => new TextHighlightComponent(),
                                                     () => new TextHighlightModel());

    }

    start() {
        this.componentManager.start();
    }

}

module.exports.TextHighlightView2 = TextHighlightView2;
