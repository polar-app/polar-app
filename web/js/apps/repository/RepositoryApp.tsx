import * as ReactDOM from 'react-dom';
import App from '../../../../apps/repository/js/App';
import * as React from 'react';
import {RemotePersistenceLayerFactory} from '../../datastore/factories/RemotePersistenceLayerFactory';
import {FileImportController} from './FileImportController';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';

export class RepositoryApp {

    public async start() {

        const persistenceLayer = await RemotePersistenceLayerFactory.create();

        const updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo> = new SimpleReactor();

        ReactDOM.render(
            <App persistenceLayer={persistenceLayer}
                 updatedDocInfoEventDispatcher={updatedDocInfoEventDispatcher}/>,

            document.getElementById('root') as HTMLElement

        );

        await new FileImportController(persistenceLayer, updatedDocInfoEventDispatcher).start();
    }

}
