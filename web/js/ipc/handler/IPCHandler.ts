import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';

export abstract class IPCHandler<M> {

    public handle(event: IPCEvent, ipcMessage: IPCMessage<any>): any {
        let message = this.createValue(ipcMessage);
        return this.handleIPC(event, message);
    }

    protected abstract handleIPC(event: IPCEvent, message: M): any;

    protected abstract createValue(ipcMessage: IPCMessage<any>): M;

}


