import {WebContents} from "electron";
import {IPCMessage} from '../../util/IPCMessage';
import {ChannelNotification} from '../channels/Channel';

export abstract class IPCHandler<E,M> {

    handle(msg: any, sender: WebContents) {

        let message = this.createMessage(msg);
        this.handleIPC(message, sender);

    }

    createMessage(msg: any): IPCMessage<M> {
        return IPCMessage.create(msg, this.createValue);
    }

    /**
     * Get the type of requests with which this handler works.
     *
     */
    protected abstract getType(): string;

    protected abstract handleIPC(channelNotification: ChannelNotification<E,M>): void;

    protected abstract createValue(): M;

}
