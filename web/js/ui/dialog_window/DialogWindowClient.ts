import {ipcRenderer} from "electron";
import {DialogWindowOptions} from './DialogWindow';
import {IPCRequest} from '../../util/IPCRequest';

export class DialogWindowClient {

    create(options: DialogWindowOptions): void {
        ipcRenderer.send("dialog-window", new IPCRequest("create", options));
    }

}


