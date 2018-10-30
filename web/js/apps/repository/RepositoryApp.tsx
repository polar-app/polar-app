import * as ReactDOM from 'react-dom';
import App from '../../../../apps/repository/js/App';
import * as React from 'react';
import {RemotePersistenceLayerFactory} from '../../datastore/factories/RemotePersistenceLayerFactory';
import {FileImportController} from './FileImportController';

export class RepositoryApp {

    public async start() {

        const persistenceLayer = await RemotePersistenceLayerFactory.create();

        ReactDOM.render(
            <App persistenceLayer={persistenceLayer}/>,
            document.getElementById('root') as HTMLElement
        );

        await new FileImportController(persistenceLayer).start();
    }

}
