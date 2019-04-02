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
import {CommentsController} from '../comments/CommentsController';
import {AnnotationBarService} from '../ui/annotationbar/AnnotationBarService';
import {AreaHighlightView} from "../highlights/area/view/AreaHighlightView";
import {AddContentImporters} from './viewer/AddContentImporters';
import {Providers} from '../util/Providers';
import {ProgressService} from '../ui/progress_bar/ProgressService';
import {PersistenceLayerManager} from '../datastore/PersistenceLayerManager';
import {PersistenceLayerManagers} from '../datastore/PersistenceLayerManagers';
import {AppOrigin} from './AppOrigin';
import {CloudService} from '../../../apps/repository/js/cloud/CloudService';

const log = Logger.create();

/**
 * Basic class for connecting event listeners and then running a launchFunction
 * once the browser is ready.
 *
 */
export class Launcher {

    /**
     * Launch the app with the given launch function.
     *
     */
    constructor() {
    }

    /**
     * Trigger the launch function.
     */
    public async trigger() {

        AppOrigin.configure();

        new ProgressService().start();

        const addContentImporter = AddContentImporters.create();

        await addContentImporter.prepare();

        const persistenceLayerManager = new PersistenceLayerManager({noSync: true});

        new CloudService(persistenceLayerManager)
            .start();

        await persistenceLayerManager.start();

        await Logging.init();

        // import content with the 'add content' button automatically.

        await addContentImporter.doImport(Providers.toInterface(persistenceLayerManager.get()));

        const model = new Model(persistenceLayerManager);

        new PagemarkView(model).start();

        const prefsProvider
            = Providers.toInterface(() => {

            const persistenceLayer = persistenceLayerManager.get();
            const datastore = persistenceLayer.datastore;
            return datastore.getPrefs().get();

        });

        new WebView(model, prefsProvider).start();
        new TextHighlightView2(model).start();
        new AreaHighlightView(model).start();
        new AnnotationSidebarService(model).start();

        // if (AppRuntime.isElectron()) {
        //     new PageSearchController(model).start();
        // }

        new CommentsController(model).start();
        new AnnotationBarService(model).start();

        const viewer = ViewerFactory.create(model);
        await new WebController(model, viewer).start();

        viewer.start();

    }

    public async launch() {

        if (document.readyState === "interactive" || document.readyState === "complete") {

            log.info("Already completed loading.");
            await this.trigger();

        } else {

            log.info("Waiting for DOM content to load");

            document.addEventListener('DOMContentLoaded', () => {

                this.trigger()
                    .catch(err => log.error("Failed to trigger: ", err));

            }, true);
        }

    }

}

export type PersistenceLayerFactory = () => Promise<ListenablePersistenceLayer>;
