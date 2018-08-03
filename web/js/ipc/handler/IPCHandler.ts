import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';

export abstract class IPCHandler<M> {

    public async handle(event: IPCEvent, ipcMessage: IPCMessage<any>): Promise<any> {
        let message = this.createValue(ipcMessage);
        return this.handleIPC(event, message);
    }

    protected async abstract handleIPC(event: IPCEvent, message: M): Promise<any>;

    protected abstract createValue(ipcMessage: IPCMessage<any>): M;

}


