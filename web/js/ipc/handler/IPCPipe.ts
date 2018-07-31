import {Pipe} from '../channels/Pipe';
import {IPCMessage} from '../../util/IPCMessage';
import {TypedPipe} from '../channels/TypedPipe';

export class IPCPipe<E> extends TypedPipe<E, IPCMessage<any>> {

    constructor(source: Pipe<E, IPCMessage<any>>) {
        super(source);
    }

    convert(obj: any): IPCMessage<any> {
        return IPCMessage.create(obj);
    }

}
