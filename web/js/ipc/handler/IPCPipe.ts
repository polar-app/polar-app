import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';
import {TypedPipe} from '../pipes/TypedPipe';
import {PipeNotification, WritablePipe} from '../pipes/Pipe';

/**
 * Takes a pipe and converts types to the types we need for IPC.
 */
export abstract class IPCPipe<E extends IPCEvent> extends TypedPipe<E, IPCMessage<any>> {

    protected abstract convertEvent(pipeNotification: PipeNotification<any, any>): E;

    protected convertMessage(msg: any): IPCMessage<any> {
        return IPCMessage.create(msg);
    }

}
