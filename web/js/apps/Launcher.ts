import {Model} from '../Model';
import {ViewerFactory} from '../viewer/ViewerFactory';
import {WebController} from '../controller/WebController';
import {Logger} from '../logger/Logger';
import {Logging} from '../logger/Logging';
import {WebView} from '../view/WebView';
import {PagemarkView} from '../pagemarks/view/PagemarkView';
import {IPersistenceLayer} from '../datastore/IPersistenceLayer';

const {TextHighlightView2} = require("../highlights/text/view/TextHighlightView2");
const {AreaHighlightView} = require("../highlights/area/view/AreaHighlightView");

const log = Logger.create();

/**
 * Basic class for connecting event listeners and then running a launchFunction
 * once the browser is ready.
 *
 */
export class Launcher {

    private readonly persistenceLayerFactory: PersistenceLayerFactory;

    /**
     * Launch the app with the given launch function.
     *
     */
    constructor(persistenceLayerFactory: PersistenceLayerFactory) {
        this.persistenceLayerFactory = persistenceLayerFactory;
    }

    /**
     * Trigger the launch function.
     */
    async trigger() {

        let persistenceLayer = await this.persistenceLayerFactory();
        await persistenceLayer.init();

        await Logging.init();

        let model = new Model(persistenceLayer);
        new WebView(model).start();
        new TextHighlightView2(model).start();
        new AreaHighlightView(model).start();
        new PagemarkView(model).start();

        let viewer = ViewerFactory.create(model);
        viewer.start();

        log.info("Stash dir: ", persistenceLayer.stashDir);
        log.info("Logs dir: ", persistenceLayer.logsDir);

        await new WebController(model, viewer).start();

    }

    async launch() {

        if (document.readyState === "interactive" || document.readyState === "complete") {
            log.info("Already completed loading.");
            await this.trigger();
        } else {
            log.info("Waiting for DOM content to load");
            document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
        }

    }

}

export interface PersistenceLayerFactory {
    (): Promise<IPersistenceLayer>;
}
