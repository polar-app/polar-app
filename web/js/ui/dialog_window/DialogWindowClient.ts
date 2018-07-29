import {ipcMain, ipcRenderer} from "electron";
import {DialogWindowOptions} from './DialogWindow';
import {IPCMessage} from '../../util/IPCMessage';

export class DialogWindowClient {

    create(options: DialogWindowOptions): Promise<void> {

        // TODO: make this async and await that the main process created the
        // dialog properly by creating a unique ID and then having the main
        // process reply with the ID...
        //
        // TODO: we also need tests to verify tht this actually works.

        let createRequest = new IPCMessage("create", options);

        let result = new Promise<void>((resolve, reject) => {

            let channel = createRequest.computeResponseChannel();

            ipcMain.once(channel, (event: any, message: IPCMessage) => {

                if(message.type === "created") {
                    resolve();
                } else {
                    reject();
                }

            });

        });

        ipcRenderer.send('dialog-window', createRequest);

        return result;

    }

}


