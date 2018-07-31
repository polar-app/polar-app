import {IPCMessage} from './IPCMessage';
import {TypedPipe} from '../channels/TypedPipe';
import {IPCEvent} from './IPCEvent';

/**
 * Takes a pipe and converts types to the types we need for IPC.
 */
export abstract class IPCPipe extends TypedPipe<any, IPCMessage<any>> {

    abstract convertEvent(obj: any): IPCEvent;

    convertMessage(obj: any): IPCMessage<any> {
        return IPCMessage.create(obj);
    }

}
