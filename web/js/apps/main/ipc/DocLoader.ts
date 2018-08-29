import {ElectronIPCPipe} from '../../../ipc/handler/ElectronIPCPipe';
import {ElectronRendererPipe} from '../../../ipc/pipes/ElectronRendererPipe';
import {IPCClient} from '../../../ipc/handler/IPCClient';
import {LoadDocRequest} from './LoadDocRequest';

let ipcPipe = new ElectronIPCPipe(new ElectronRendererPipe());
let ipcClient = new IPCClient(ipcPipe);

export class DocLoader {

    /**
     *
     */
    static async load(loadDocRequest: LoadDocRequest): Promise<void> {
        await ipcClient.execute('/main/load-doc', loadDocRequest);
    }

}
