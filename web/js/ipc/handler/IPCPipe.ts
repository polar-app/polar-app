import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';
import {TypedPipe} from '../pipes/TypedPipe';
import {PipeNotification} from '../pipes/Pipe';

/**
 * Takes a pipe and converts types to the types we need for IPC.
 */
export abstract class IPCPipe<E extends IPCEvent> extends TypedPipe<E, IPCMessage<any>> {

    abstract convertEvent(pipeNotification: PipeNotification<any, any>): E;

    convertMessage(msg: any): IPCMessage<any> {
        return IPCMessage.create(msg);
    }

}
