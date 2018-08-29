import {IPCHandler} from '../../../../ipc/handler/IPCHandler';
import {IPCMessage} from '../../../../ipc/handler/IPCMessage';
import {IPCEvent} from '../../../../ipc/handler/IPCEvent';
import {LoadDocRequest} from '../LoadDocRequest';
import {Directories} from '../../../../datastore/Directories';
import {MainAppController} from '../../MainAppController';

export class LoadDocHandler  extends IPCHandler<LoadDocRequest> {

    private readonly mainAppController: MainAppController;

    private readonly directories = new Directories();

    constructor(mainAppController: MainAppController) {
        super();
        this.mainAppController = mainAppController;
    }

    protected createValue(ipcMessage: IPCMessage<any>): LoadDocRequest {
        return ipcMessage.value;
    }

    protected async handleIPC(event: IPCEvent, loadDocRequest: LoadDocRequest): Promise<void> {

        let path = `${this.directories.stashDir}/${loadDocRequest.filename}`;

        await this.mainAppController.handleLoadDoc(path, loadDocRequest.newWindow);

    }

}
