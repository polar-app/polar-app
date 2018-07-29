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

        ipcMain.on('dialog-window', (event: Electron.Event, request: IPCMessage) => {

            if(request.type === "create") {
                this.onCreate(<DialogWindowOptions>request.value, event.sender, request);
            }

        });

    }

    onCreate(options: DialogWindowOptions, sender: WebContents, request: IPCMessage ) {

        DialogWindow.create(options)
            .then(() => {
                this.sendCreated(request, sender);
            })
            .catch(err => log.error("Could not create dialog window: ", err));

    }

    sendCreated(request: IPCMessage, sender: WebContents) {
        // create a dedicated channel with one possible message for the response.
        sender.send(request.computeResponseChannel(), new IPCMessage("created", true));
    }

}
