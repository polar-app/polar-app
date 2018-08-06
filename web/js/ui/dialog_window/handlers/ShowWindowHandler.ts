import {BrowserWindow} from 'electron';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {DialogWindowReference} from '../DialogWindowReference';
import {AbstractDialogWindowReferenceHandler} from './AbstractDialogWindowReferenceHandler';

export class ShowWindowHandler extends AbstractDialogWindowReferenceHandler {

    protected async handleIPC(event: IPCEvent, request: DialogWindowReference): Promise<boolean> {

        let browserWindow = BrowserWindow.fromId(request.id);

        // TODO we should probably do this via an activate method which combines
        // show + focus
        browserWindow.show();
        browserWindow.focus();

        return true;

    }

}

