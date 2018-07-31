import {IPCMessage} from './IPCMessage';
import {WritablePipe} from '../channels/Pipe';

/**
 * Represents an event that we can respond with.
 */
export class IPCEvent {

    public readonly writeablePipe: WritablePipe<IPCMessage<any>>;

    constructor(writeablePipe: WritablePipe<IPCMessage<any>>) {
        this.writeablePipe = writeablePipe;
    }

}
