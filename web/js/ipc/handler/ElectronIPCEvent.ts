import {BrowserWindow} from 'electron';
import {IPCEvent} from './IPCEvent';
import {WritablePipe} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {WindowReference} from '../../ui/dialog_window/WindowReference';
import WebContents = Electron.WebContents;

export class ElectronIPCEvent extends IPCEvent {

    public readonly senderWindowReference: WindowReference;

    constructor(writeablePipe: WritablePipe<IPCMessage<any>>, message: IPCMessage<any>, sender: WebContents) {
        super(writeablePipe, message);

        let browserWindow = BrowserWindow.fromWebContents(sender);
        this.senderWindowReference = new WindowReference(browserWindow.id);
    }

}
