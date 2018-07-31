import {IPCMessage} from '../../util/IPCMessage';

export abstract class IPCHandler<E,M> {

    handle(event: E, ipcMessage: IPCMessage<any>) {
        let message = this.createValue(ipcMessage);
        this.handleIPC(event, message);
    }

    /**
     * Get the type of requests with which this handler works.
     *
     */
    protected abstract getType(): string;

    protected abstract handleIPC(event: E, message: M): void;

    protected abstract createValue(ipcMessage: IPCMessage<M>): M;

}


