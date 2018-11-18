import * as ReactDOM from 'react-dom';
import App from '../../../../apps/repository/js/App';
import * as React from 'react';
import {RemotePersistenceLayerFactory} from '../../datastore/factories/RemotePersistenceLayerFactory';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {AppInstance} from '../../electron/framework/AppInstance';

export class RepositoryApp {

    public async start() {

        const persistenceLayer = RemotePersistenceLayerFactory.create();

        await persistenceLayer.init();

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        await new FileImportController(persistenceLayer, updatedDocInfoEventDispatcher).start();

        ReactDOM.render(
            <App persistenceLayerFactory={() => persistenceLayer}
                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}/>,

            document.getElementById('root') as HTMLElement

        );

        AppInstance.notifyStarted('RepositoryApp');

    }

}
