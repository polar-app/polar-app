import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {Model} from '../Model';
import {ViewerFactory} from '../viewer/ViewerFactory';

const {SystemClock} = require("../time/SystemClock.js");
const {WebController} = require("../controller/WebController.js");
const {WebView} = require("../view/WebView.js");
const {TextHighlightView} = require("../highlights/text/view/TextHighlightView");
const {TextHighlightView2} = require("../highlights/text/view/TextHighlightView2");
const {PagemarkView, PAGEMARK_VIEW_ENABLED} = require("../pagemarks/view/PagemarkView");
const {PagemarkController} = require("../pagemarks/controller/PagemarkController");
const {AreaHighlightView} = require("../highlights/area/view/AreaHighlightView");


/**
 * Basic class for connecting event listeners and then running a launchFunction
 * once the browser is ready.
 *
 * @type {Launcher}
 */
export class Launcher {

    private readonly persistenceLayerFactory: PersistenceLayerFactory;

    /**
     * Launch the app with the given launch function.
     *
     * @param persistenceLayerFactory
     */
    constructor(persistenceLayerFactory: PersistenceLayerFactory) {
        this.persistenceLayerFactory = persistenceLayerFactory;
    }

    /**
     * Trigger the launch function.
     */
    async trigger() {

        let persistenceLayer = await this.persistenceLayerFactory();

        let model = new Model(persistenceLayer);
        new WebView(model).start();
        //new TextHighlightView(model).start();
        new TextHighlightView2(model).start();
        new AreaHighlightView(model).start();

        if(PAGEMARK_VIEW_ENABLED) {
            new PagemarkView(model).start();
        }

        let viewer = ViewerFactory.create(model);
        viewer.start();

        await persistenceLayer.init();

        await new WebController(model, viewer).start();

    }

    async launch() {

        if (document.readyState === "interactive" || document.readyState === "complete") {
            console.log("Already completed loading.");
            await this.trigger();
        } else {
            console.log("Waiting for DOM content to load");
            document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
        }

    }

}

export interface PersistenceLayerFactory {
    (): PersistenceLayer;
}
