import {ipcMain, WebContents} from "electron";
import {IPCMessage} from '../../util/IPCMessage';
import {DialogWindow, DialogWindowOptions} from './DialogWindow';
import {Logger} from '../../logger/Logger';
import {DialogWindowReference} from './DialogWindowReference';
import {ParentWindowRegistry} from './ParentWindowRegistry';
import {ParentWindowReference} from './ParentWindowReference';
import BrowserWindow = Electron.BrowserWindow;
import {GetParentWindowRequest} from './ipc/DialogWindows';

const log = Logger.create();

/**
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
export class DialogWindowService {

    private parentWindowRegistry: ParentWindowRegistry = new ParentWindowRegistry();

    start() {

        ipcMain.on('dialog-window', (event: Electron.Event, message: any) => {

            let ipcMessage = IPCMessage.create(message);

            if(ipcMessage.type === 'create') {
                let createWindowMessage = IPCMessage.create<DialogWindowOptions>(message);
                this.onCreate(DialogWindowOptions.create(createWindowMessage.value), event.sender, createWindowMessage);
            }

            if(ipcMessage.type === 'get-parent-window') {
                let getParentWindowRequest = IPCMessage.create<GetParentWindowRequest>(message);
                this.onCreate(DialogWindowOptions.create(createWindowMessage.value), event.sender, createWindowMessage);
            }

        });

    }

    onCreate(options: DialogWindowOptions, sender: WebContents, createWindowMessage: IPCMessage<DialogWindowOptions> ) {

        DialogWindow.create(options)
            .then((dialogWindow: DialogWindow) => {

                let browserWindow = BrowserWindow.fromWebContents(sender);
                let parentWindowReference = new ParentWindowReference(browserWindow.id);

                this.parentWindowRegistry.register(dialogWindow.dialogWindowReference, parentWindowReference);

                this.sendCreated(createWindowMessage, sender, dialogWindow.dialogWindowReference);
            })
            .catch(err => log.error("Could not create dialog window: ", err));

    }

    sendCreated(createWindowMessage: IPCMessage<DialogWindowOptions>, sender: WebContents, dialogWindowReference: DialogWindowReference) {
        // create a dedicated channel with one possible message for the response.
        let createdWindowMessage = new IPCMessage<DialogWindowReference>("created", dialogWindowReference);
        sender.send(createWindowMessage.computeResponseChannel(), createdWindowMessage);
    }

}
