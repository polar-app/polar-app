import {ReadablePipe} from '../channels/Pipe';
import {IPCMessage} from './IPCMessage';
import {TypedPipe} from '../channels/TypedPipe';

export class IPCPipe<E> extends TypedPipe<E, IPCMessage<any>> {

    constructor(source: ReadablePipe<E, any>) {
        super(source);
    }

    convertEvent(obj: any): E {
        // FIXME: we need one for Electron...
        return undefined;
    }

    convertMessage(obj: any): IPCMessage<any> {
        return IPCMessage.create(obj);
    }

}
