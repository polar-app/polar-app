import {ipcMain} from "electron";
import {IPCRequest} from '../../util/IPCRequest';
import {DialogWindow, DialogWindowOptions} from './DialogWindow';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

/**
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
class DialogWindowService {

    start() {

        ipcMain.on('dialog-window', (event: any, request: IPCRequest) => {

            if(request.type === "create") {
                this.onCreate(<DialogWindowOptions>request.value);
            }

        });

    }

    onCreate(options: DialogWindowOptions) {
        DialogWindow.create(options).catch(err => log.error("Could not create dialog window: ", err));
    }

}
