import {BrowserWindow} from 'electron';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {DialogWindowReference} from '../DialogWindowReference';
import {AbstractDialogWindowReferenceHandler} from './AbstractDialogWindowReferenceHandler';

export class HideWindowHandler extends AbstractDialogWindowReferenceHandler {

    protected async handleIPC(event: IPCEvent, request: DialogWindowReference): Promise<boolean> {

        let browserWindow = BrowserWindow.fromId(request.id);
        browserWindow.hide();

        return true;

    }

}

