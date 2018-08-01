import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';
import {TypedPipe} from '../pipes/TypedPipe';

/**
 * Takes a pipe and converts types to the types we need for IPC.
 */
export abstract class IPCPipe<E> extends TypedPipe<any, IPCMessage<any>> {

    abstract convertEvent(obj: any): IPCEvent;

    convertMessage(obj: any): IPCMessage<any> {
        return IPCMessage.create(obj);
    }

}
