import {ElectronIPCPipe} from '../../../../ipc/handler/ElectronIPCPipe';
import {ElectronRendererPipe} from '../../../../ipc/pipes/ElectronRendererPipe';
import {IPCClient} from '../../../../ipc/handler/IPCClient';
import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from '../../../../Preconditions';
import {IProvider} from '../../../../util/Providers';
import {PersistenceLayer} from '../../../../datastore/PersistenceLayer';

const ipcPipe = new ElectronIPCPipe(new ElectronRendererPipe());
const ipcClient = new IPCClient(ipcPipe);

export class ElectronDocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public async load(loadDocRequest: LoadDocRequest) {

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.fileRef, "fileRef");
        Preconditions.assertPresent(loadDocRequest.fileRef.name, "fileRef.name");

        await ipcClient.execute('/main/load-doc', loadDocRequest);

    }

}
