const {SystemClock} = require("../time/SystemClock.js");
const {Model} = require("../Model.js");
const {WebController} = require("../controller/WebController.js");
const {WebView} = require("../view/WebView.js");
const {TextHighlightView} = require("../highlights/text/view/TextHighlightView");
const {TextHighlightView2} = require("../highlights/text/view/TextHighlightView2");
const {PagemarkView, PAGEMARK_VIEW_ENABLED} = require("../pagemarks/view/PagemarkView");
const {PagemarkController} = require("../pagemarks/controller/PagemarkController");
const {AreaHighlightView} = require("../highlights/area/view/AreaHighlightView");

const {ViewerFactory} = require("../viewer/ViewerFactory");

/**
 * Basic class for connecting event listeners and then running a launchFunction
 * once the browser is ready.
 *
 * @type {Launcher}
 */
class Launcher {

    /**
     * Launch the app with the given launch function.
     *
     * @param persistenceLayerFactory
     */
    constructor(persistenceLayerFactory) {
        this.persistenceLayerFactory = persistenceLayerFactory;
    }

    /**
     * Trigger the launch function.
     */
    async trigger() {

        let persistenceLayer = await this.persistenceLayerFactory();

        let clock = new SystemClock();
        let model = new Model(persistenceLayer, clock);
        new WebView(model).start();
        //new TextHighlightView(model).start();
        new TextHighlightView2(model).start();
        new AreaHighlightView(model).start();

        if(PAGEMARK_VIEW_ENABLED) {
            new PagemarkView(model).start();
        }

        ViewerFactory.create().start();

        await persistenceLayer.init();

        new PagemarkController(model).start();

        new WebController(model).start();

    }

    async launch() {

        if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
            console.log("Already completed loading.");
            await this.trigger();
        } else {
            console.log("Waiting for DOM content to load");
            document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
        }

    }

}

module.exports.Launcher = Launcher;
