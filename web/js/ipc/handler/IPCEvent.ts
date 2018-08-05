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

    constructor(responsePipe: WritablePipe<IPCMessage<any>>, message: IPCMessage<any>) {
        this.responsePipe = responsePipe;
        this.message = message;
        this.response = new IPCResponse(responsePipe, message);
    }

    // sendResult<T>(result: T) {
    //     let ipcMessage = new IPCMessage<T>('result', result);
    //     this.responsePipe.write(this.message.computeResponseChannel(), ipcMessage);
    // }

}
