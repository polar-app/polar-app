import {ipcRenderer} from 'electron';
import {DialogWindowOptions} from './DialogWindow';
import {IPCMessage} from '../../ipc/handler/IPCMessage';
import {DialogWindowReference} from './DialogWindowReference';
import {IPCClient} from '../../ipc/handler/IPCClient';
import {ElectronRendererPipe} from '../../ipc/pipes/ElectronRendererPipe';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {Pipe} from '../../ipc/pipes/Pipe';
import {ElectronRenderToRendererPipe} from '../../ipc/pipes/ElectronRenderToRendererPipe';
import {ElectronRendererContext} from '../../ipc/handler/ElectronContext';

let ipcPipe = new ElectronIPCPipe(new ElectronRendererPipe());
let ipcClient = new IPCClient(ipcPipe);

export class DialogWindowClient {

    private readonly dialogWindowReference: DialogWindowReference;

    constructor(dialogWindowReference: DialogWindowReference) {
        this.dialogWindowReference = dialogWindowReference;
    }

    async show(): Promise<void> {
        await ipcClient.execute("/api/dialog-window-service/show", this.dialogWindowReference);
    }

    async hide(): Promise<void> {
        await ipcClient.execute("/api/dialog-window-service/hide", this.dialogWindowReference);
    }

    /**
     * Send a message to the ipcRenderer in the remote window.
     */
    send(channel: string, message: any) {
        ipcRenderer.sendTo(this.dialogWindowReference.id, channel, message);
    }

    /**
     * Create a pipe to this BrowserWindow which can be used for IPC.
     */
    createPipe(): Pipe<Electron.Event, any> {
        return new ElectronRenderToRendererPipe(this.dialogWindowReference);
    }

    createClient() {
        let electronIPCPipe = new ElectronIPCPipe(this.createPipe());
        return new IPCClient(electronIPCPipe, new ElectronRendererContext(this.dialogWindowReference));
    }

    /**
     * Create a new DialogWindow as a client. We have a lightweight message to
     * the remote window to show/hide and work with it indirectly.
     *
     */
    static async create(options: DialogWindowOptions): Promise<DialogWindowClient> {

        let result = await ipcClient.execute('/api/dialog-window-service/create', options);

        // TODO: we need to auto-marshal these to the correct objects but the
        // IPC framework doesn't support this yet.
        let createdWindowMessage = IPCMessage.create<DialogWindowReference>(result);

        return new DialogWindowClient(createdWindowMessage.value);

    }

}


