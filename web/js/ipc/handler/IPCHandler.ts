import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';

export abstract class IPCHandler<M> {

    handle(event: IPCEvent, ipcMessage: IPCMessage<any>) {
        let message = this.createValue(ipcMessage);
        this.handleIPC(event, message);
    }

    protected abstract handleIPC(event: IPCEvent, message: M): void;

    protected abstract createValue(ipcMessage: IPCMessage<any>): M;

}


