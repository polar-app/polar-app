import {IPCEvent} from './IPCEvent';
import {WritablePipe} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import WebContents = Electron.WebContents;

export class ElectronIPCEvent extends IPCEvent {

    public readonly sender: WebContents;

    constructor(writeablePipe: WritablePipe<IPCMessage<any>>, sender: WebContents) {
        super(writeablePipe);
        this.sender = sender;
    }

}
