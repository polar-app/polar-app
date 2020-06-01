import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {ipcRenderer} from 'electron';

export class ElectronDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        return {

            async load(): Promise<void> {

                Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
                Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
                Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

                ipcRenderer.send('load-doc-request', loadDocRequest);

            }

        };

    }

}

