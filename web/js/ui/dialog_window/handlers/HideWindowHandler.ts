import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {DialogWindowReference} from '../DialogWindowReference';
import {AbstractDialogWindowReferenceHandler} from './AbstractDialogWindowReferenceHandler';
import BrowserWindow = Electron.BrowserWindow;

export class HideWindowHandler extends AbstractDialogWindowReferenceHandler {

    protected handleIPC(event: IPCEvent, request: DialogWindowReference): void {

        let browserWindow = BrowserWindow.fromId(request.id);
        browserWindow.hide();

    }

}

