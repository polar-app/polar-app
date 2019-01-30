import {Model} from '../model/Model';
import {ViewerFactory} from '../viewer/ViewerFactory';
import {WebController} from '../controller/WebController';
import {Logger} from '../logger/Logger';
import {Logging} from '../logger/Logging';
import {WebView} from '../view/WebView';
import {PagemarkView} from '../pagemarks/view/PagemarkView';
import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {TextHighlightView2} from '../highlights/text/view/TextHighlightView2';
import {AnnotationSidebarService} from '../annotation_sidebar/AnnotationSidebarService';
import {PageSearchController} from '../page_search/PageSearchController';
import {CommentsController} from '../comments/CommentsController';
import {AnnotationBarService} from '../ui/annotationbar/AnnotationBarService';
import {AreaHighlightView} from "../highlights/area/view/AreaHighlightView";
import {AppRuntime} from '../AppRuntime';

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
    public async trigger() {

        console.log("Running with app runtime: " + AppRuntime.get());

        const persistenceLayer = await this.persistenceLayerFactory();
        await persistenceLayer.init();

        await Logging.init();

        const model = new Model(persistenceLayer);

        new WebView(model).start();
        new TextHighlightView2(model).start();
        new AreaHighlightView(model).start();
        new PagemarkView(model).start();
        new AnnotationSidebarService(model).start();

        // if (AppRuntime.isElectron()) {
        //     new PageSearchController(model).start();
        // }

        new CommentsController(model).start();
        new AnnotationBarService(model).start();

        const viewer = ViewerFactory.create(model);
        viewer.start();
        await new WebController(model, viewer).start();

    }

    public async launch() {

        if (document.readyState === "interactive" || document.readyState === "complete") {
            log.info("Already completed loading.");
            await this.trigger();
        } else {
            log.info("Waiting for DOM content to load");
            document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
        }

    }

}

export type PersistenceLayerFactory = () => Promise<ListenablePersistenceLayer>;
