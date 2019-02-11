import {ElectronIPCPipe} from '../../../ipc/handler/ElectronIPCPipe';
import {ElectronRendererPipe} from '../../../ipc/pipes/ElectronRendererPipe';
import {IPCClient} from '../../../ipc/handler/IPCClient';
import {LoadDocRequest} from './LoadDocRequest';
import {Preconditions} from '../../../Preconditions';

const ipcPipe = new ElectronIPCPipe(new ElectronRendererPipe());
const ipcClient = new IPCClient(ipcPipe);

export class DocLoader {

    public static async load(loadDocRequest: LoadDocRequest): Promise<void> {

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.filename, "filename");

        // FIXME this is not supported on the web...

        await ipcClient.execute('/main/load-doc', loadDocRequest);

    }

}
