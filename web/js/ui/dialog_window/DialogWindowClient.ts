import {ipcRenderer} from 'electron';
import {DialogWindowOptions} from './DialogWindow';
import {IPCMessage} from '../../util/IPCMessage';
import {DialogWindowReference} from './DialogWindowReference';
import {IPCRendererPromises} from '../../electron/framework/IPCRenderPromises';

export class DialogWindowClient {

    private dialogWindowReference: DialogWindowReference;

    constructor(dialogWindowReference: DialogWindowReference) {
        this.dialogWindowReference = dialogWindowReference;
    }

    show(): void {

    }

    hide(): void {

    }

    /**
     * Send a message to the ipcRenderer in the remote window.
     *
     * @param {void} message
     * @return {Promise<void>}
     */
    async send(message: void) {


    }

    /**
     * Create a new DialogWindow as a client. We have a lightweight message to
     * the remote window to show/hide and work with it indirectly.
     *
     */
    static async create(options: DialogWindowOptions): Promise<DialogWindowClient> {

        // TODO: make this async and await that the main process created the
        // dialog properly by creating a unique ID and then having the main
        // process reply with the ID...
        //
        // TODO: we also need tests to verify tht this actually works.

        let createRequest = new IPCMessage<DialogWindowOptions>('create', options);

        let channel = createRequest.computeResponseChannel();

        let createdPromise = await IPCRendererPromises.once(channel);

        ipcRenderer.send('dialog-window', createRequest);

        let {message} = await createdPromise;

        let createdWindowMessage = IPCMessage.create<DialogWindowReference>(message);

        return new DialogWindowClient(createdWindowMessage.value);

    }

}


