import {Channel} from '../channels/Channel';
import {IPCMessage} from '../../util/IPCMessage';
import {TypedChannel} from '../channels/TypedChannel';

export class IPCChannel<E> extends TypedChannel<E, IPCMessage<any>> {

    constructor(source: Channel<E, IPCMessage<any>>) {
        super(source);
    }

    convert(obj: any): IPCMessage<any> {
        return IPCMessage.create(obj);
    }

}
