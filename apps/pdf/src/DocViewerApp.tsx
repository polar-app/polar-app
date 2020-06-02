import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PersistenceLayerManager} from "../../../web/js/datastore/PersistenceLayerManager";
import {AppInitializer} from "../../../web/js/apps/repository/AppInitializer";
import {ASYNC_NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ProgressService} from "../../../web/js/ui/progress_bar/ProgressService";
import {PersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {DocViewerScreen} from "./DocViewerScreen";
import {BrowserRouter} from 'react-router-dom';

export class DocViewerApp {

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

        const persistenceLayerProvider = () => this.persistenceLayerManager.get();
        ReactDOM.render((
            <PersistenceLayerContext.Provider value={{persistenceLayerProvider}}>
                <BrowserRouter>
                    <DocViewerScreen/>
                </BrowserRouter>
            </PersistenceLayerContext.Provider>
            ), rootElement);

    }

}
