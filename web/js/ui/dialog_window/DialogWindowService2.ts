import {ipcMain, WebContents} from "electron";
import {IPCMessage} from '../../util/IPCMessage';
import {DialogWindow, DialogWindowOptions} from './DialogWindow';
import {Logger} from '../../logger/Logger';
import {DialogWindowReference} from './DialogWindowReference';
import {ParentWindowRegistry} from './ParentWindowRegistry';
import {ParentWindowReference} from './ParentWindowReference';
import BrowserWindow = Electron.BrowserWindow;
import {ChannelListener} from '../../ipc/channels/Pipe';

const log = Logger.create();

const CHANNEL_NAME = 'dialog-window';

/**
 *
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
export class DialogWindowService {

    private parentWindowRegistry: ParentWindowRegistry = new ParentWindowRegistry();

    start() {

        ipcMain.on(CHANNEL_NAME, (event: Electron.Event, message: any) => {

            let ipcMessage = IPCMessage.create(message);

            let sender = event.sender;

            if(ipcMessage.type === 'create') {
                let createWindowMessage = IPCMessage.create(message, DialogWindowOptions.create);
                this.onCreateRequest(createWindowMessage, sender);
            }

            if(ipcMessage.type === 'get-parent-window') {
                let getParentWindowMessage = IPCMessage.create(message, DialogWindowReference.create);
                this.onGetParentWindowRequest(getParentWindowMessage, sender);
            }

        });

    }

    private onGetParentWindowRequest(request: IPCMessage<DialogWindowReference>, sender: WebContents) {

        let dialogWindowReference = request.value;

        let parentWindowReference = this.parentWindowRegistry.get(dialogWindowReference);

        let parentWindowReferenceMessage = new IPCMessage<DialogWindowReference>('parent-window-reference', parentWindowReference);

        sender.send(CHANNEL_NAME, parentWindowReferenceMessage)

    }

    private onCreateRequest(request: IPCMessage<DialogWindowOptions>, sender: WebContents ) {

        let dialogWindowOptions = request.value;

        DialogWindow.create(dialogWindowOptions)
            .then((dialogWindow: DialogWindow) => {

                let browserWindow = BrowserWindow.fromWebContents(sender);
                let parentWindowReference = new ParentWindowReference(browserWindow.id);

                this.parentWindowRegistry.register(dialogWindow.dialogWindowReference, parentWindowReference);

                this.sendCreated(request, sender, dialogWindow.dialogWindowReference);
            })
            .catch(err => log.error("Could not create dialog window: ", err));

    }

    private sendCreated(createWindowMessage: IPCMessage<DialogWindowOptions>, sender: WebContents, dialogWindowReference: DialogWindowReference) {
        // create a dedicated channel with one possible message for the response.
        let createdWindowMessage = new IPCMessage<DialogWindowReference>('created', dialogWindowReference);
        sender.send(createWindowMessage.computeResponseChannel(), createdWindowMessage);
    }

}

