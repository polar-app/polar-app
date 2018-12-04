import * as ReactDOM from 'react-dom';
import App from '../../../../apps/repository/js/App';
import * as React from 'react';
import {RemotePersistenceLayerFactory} from '../../datastore/factories/RemotePersistenceLayerFactory';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';
import {PersistenceLayers} from '../../datastore/PersistenceLayers';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';

export class RepositoryApp {

    public async start() {

        const persistenceLayerManager = new PersistenceLayerManager();

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        await new FileImportController(persistenceLayerManager, updatedDocInfoEventDispatcher).start();

        ReactDOM.render(
            <App persistenceLayerManager={persistenceLayerManager}
                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}/>,

            document.getElementById('root') as HTMLElement

        );

        AppInstance.notifyStarted('RepositoryApp');

    }

}
