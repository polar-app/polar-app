import {ipcMain, WebContents} from "electron";
import {IPCMessage} from '../../util/IPCMessage';
import {DialogWindow, DialogWindowOptions} from './DialogWindow';
import {Logger} from '../../logger/Logger';

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

            let ipcMessage = IPCMessage.create(message);

            if(ipcMessage.type === "create") {
                this.onCreate(DialogWindowOptions.create(ipcMessage.value), event.sender, ipcMessage);
            }

        });

    }

    onCreate(options: DialogWindowOptions, sender: WebContents, ipcMessage: IPCMessage ) {

        DialogWindow.create(options)
            .then(() => {
                this.sendCreated(ipcMessage, sender);
            })
            .catch(err => log.error("Could not create dialog window: ", err));

    }

    sendCreated(ipcMessage: IPCMessage, sender: WebContents) {

        // create a dedicated channel with one possible message for the response.
        sender.send(ipcMessage.computeResponseChannel(), new IPCMessage("created", true));
    }

}
