import {BrowserWindow, WebContents} from 'electron';
import {IPCEvent} from './IPCEvent';
import {WritablePipe} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {WindowReference} from '../../ui/dialog_window/WindowReference';
import {Preconditions} from '../../Preconditions';

export class ElectronIPCEvent extends IPCEvent {

    // TODO: just refactor this into the main IPC Event and have it be a context
    // so we don't need the Electron IPC Event system..
    public readonly senderWindowReference: WindowReference;

    constructor(responsePipe: WritablePipe<IPCMessage<any>>, message: IPCMessage<any>, sender: WebContents) {
        super(responsePipe, message);

        Preconditions.assertNotNull(sender, "sender");

        //let browserWindow = BrowserWindow.fromWebContents(sender);
        this.senderWindowReference = new WindowReference(sender.id);

    }

}
