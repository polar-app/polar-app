import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PersistenceLayerManager} from "../../../web/js/datastore/PersistenceLayerManager";
import {AppInitializer} from "../../../web/js/apps/repository/AppInitializer";
import {ASYNC_NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ControlledAnnotationBars} from "../../../web/js/ui/annotationbar/ControlledAnnotationBars";
import {ControlledPopupProps} from "../../../web/js/ui/popup/ControlledPopup";
import {
    AnnotationBarCallbacks,
    OnHighlightedCallback
} from "../../../web/js/ui/annotationbar/ControlledAnnotationBar";
import {HighlightCreatedEvent} from "../../../web/js/comments/react/HighlightCreatedEvent";
import {SimpleReactor} from "../../../web/js/reactor/SimpleReactor";
import {PopupStateEvent} from "../../../web/js/ui/popup/PopupStateEvent";
import {TriggerPopupEvent} from "../../../web/js/ui/popup/TriggerPopupEvent";
import {ProgressService} from "../../../web/js/ui/progress_bar/ProgressService";
import {PDFViewer} from './PDFViewer';
import {MUIAppRoot} from "../../../web/js/mui/MUIAppRoot";
import {PersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {AnnotationSidebarStoreProvider} from './AnnotationSidebarStore';
import {DocMetaContextProvider} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {DocViewerStore} from "./DocViewerStore";
import {UserTagsProvider} from "../../repository/js/persistence_layer/UserTagsProvider2";
import {MUIDialogController} from "../../../web/spectron0/material-ui/dialogs/MUIDialogController";

export class PDFApp {

    constructor(private readonly persistenceLayerManager = new PersistenceLayerManager({noSync: true, noInitialSnapshot: true})) {
    }

    public async start() {

        const persistenceLayerManager = this.persistenceLayerManager;

        console.time('AppInitializer.init');

        const app = await AppInitializer.init({
            persistenceLayerManager,
            onNeedsAuthentication: ASYNC_NULL_FUNCTION
        });

        console.timeEnd('AppInitializer.init');

        console.time('persistenceLayerManager.start');
        await persistenceLayerManager.start();
        console.timeEnd('persistenceLayerManager.start');;

        new ProgressService().start();

        const rootElement = document.getElementById('root') as HTMLElement;

        // TODO: pass the appURL up so I can use the persistenceLayer to add
        // a snapshot listener for the doc then load it...

        this.startAnnotationBar();

        // FIXME: I need docTag and userTags here to pass them up ...

        // {/*<PersistenceLayerApp repoDocMetaManager={app.repoDocMetaManager}*/}
        // {/*                     repoDocMetaLoader={repoDocMetaLoader}*/}
        // {/*                     persistenceLayerManager={persistenceLayerManager}*/}
        // {/*                     render={(docRepo) => (*/}

        const persistenceLayerProvider = () => this.persistenceLayerManager.get();

        ReactDOM.render((
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                 }}>

                <MUIAppRoot>

                    <MUIDialogController>
                        <PersistenceLayerContext.Provider value={{persistenceLayerProvider}}>
                            <UserTagsProvider>
                                <DocMetaContextProvider>
                                    <DocViewerStore>
                                        <AnnotationSidebarStoreProvider>
                                            <PDFViewer persistenceLayerProvider={() => this.persistenceLayerManager.get()}
                                                       tagsProvider={() => []}/>
                                        </AnnotationSidebarStoreProvider>
                                    </DocViewerStore>
                                </DocMetaContextProvider>
                            </UserTagsProvider>
                        </PersistenceLayerContext.Provider>
                    </MUIDialogController>

                </MUIAppRoot>

            </div>
            ), rootElement);

    }


    private startAnnotationBar() {

        const popupStateEventDispatcher = new SimpleReactor<PopupStateEvent>();
        const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

        const annotationBarControlledPopupProps: ControlledPopupProps = {
            id: 'annotationbar',
            placement: 'top',
            popupStateEventDispatcher,
            triggerPopupEventDispatcher
        };

        const onHighlighted: OnHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {
            console.log("onHighlighted: ", highlightCreatedEvent);
        };

        const annotationBarCallbacks: AnnotationBarCallbacks = {
            onHighlighted,
            // onComment
        };

        ControlledAnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks);

    }

}
