import {IPCMessage} from './IPCMessage';
import {WritablePipe} from '../pipes/Pipe';

/**
 * Represents an event that we can respond with.
 */
export class IPCEvent {

    public readonly writeablePipe: WritablePipe<IPCMessage<any>>;

    public readonly message: IPCMessage<any>;

    constructor(writeablePipe: WritablePipe<IPCMessage<any>>, message: IPCMessage<any>) {
        this.writeablePipe = writeablePipe;
        this.message = message;
    }

    sendResult<T>(result: T) {
        let ipcMessage = new IPCMessage<T>('result', result);
        this.writeablePipe.write(this.message.computeResponseChannel(), ipcMessage);
    }

}
