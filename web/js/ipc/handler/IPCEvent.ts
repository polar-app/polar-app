import {IPCMessage} from './IPCMessage';
import {WritablePipe} from '../pipes/Pipe';
import {IPCResponse} from './IPCResponse';

/**
 * Represents an event that we can respond with.
 */
export class IPCEvent {

    public readonly responsePipe: WritablePipe<IPCMessage<any>>;

    public readonly message: IPCMessage<any>;

    public readonly response: IPCResponse;

    /**
     * An optional sender of this IPC message. Since it could be the main that
     * is sending the event (or test code) this is optional.
     */
    public readonly webContents?: Electron.WebContents;

    constructor(responsePipe: WritablePipe<IPCMessage<any>>, message: IPCMessage<any>, webContents?: Electron.WebContents) {
        this.responsePipe = responsePipe;
        this.message = message;
        this.response = new IPCResponse(responsePipe, message);
        this.webContents = webContents;
    }

    // sendResult<T>(result: T) {
    //     let ipcMessage = new IPCMessage<T>('result', result);
    //     this.responsePipe.write(this.message.computeResponseChannel(), ipcMessage);
    // }

}
