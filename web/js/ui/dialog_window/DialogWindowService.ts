import {ipcMain, WebContents} from "electron";
import {IPCMessage} from '../../util/IPCMessage';
import {DialogWindow, DialogWindowOptions} from './DialogWindow';
import {Logger} from '../../logger/Logger';
import {DialogWindowReference} from './DialogWindowReference';

const log = Logger.create();

/**
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
export class DialogWindowService {

    start() {

        ipcMain.on('dialog-window', (event: Electron.Event, message: any) => {

            let ipcMessage = IPCMessage.create<DialogWindowOptions>(message);

            if(ipcMessage.type === "create") {
                let createWindowMessage = IPCMessage.create<DialogWindowOptions>(message);
                this.onCreate(DialogWindowOptions.create(createWindowMessage.value), event.sender, createWindowMessage);
            }

        });

    }

    onCreate(options: DialogWindowOptions, sender: WebContents, createWindowMessage: IPCMessage<DialogWindowOptions> ) {

        DialogWindow.create(options)
            .then((dialogWindow: DialogWindow) => {
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
