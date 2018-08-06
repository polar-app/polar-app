import {Pipe, PipeListener, PipeNotification} from './Pipe';
import {IPCEvent} from '../handler/IPCEvent';
import {Pipes} from './Pipes';
import {WritablePipes} from '../handler/WritablePipes';

export class WindowMessagePipe implements Pipe<IPCEvent, any> {

    on(channel: string, listener: PipeListener<IPCEvent, any>): void {
        window.addEventListener('message', WindowMessagePipe.createListener(channel, listener));
    }

    once(channel: string, listener: PipeListener<IPCEvent, any>): void {
        let messageListener = WindowMessagePipe.createListener(channel, listener);

        window.addEventListener('message', (event: any) => {
            if(messageListener(event)) {
                window.removeEventListener('message', messageListener);
            }
        });

    }

    when(channel: string): Promise<PipeNotification<IPCEvent, any>> {
        return Pipes.when(this, channel);
    }

    write(channel: string, message: any): void {
        throw new Error("Not implemented");
    }

    static createListener(channel: string, listener: PipeListener<IPCEvent, any>): WindowMessageListener {

        return (event: any) => {

            if(event && event.data && event.data.channel && event.data.channel == channel) {
                let data = event.data;
                let writablePipe = WindowMessagePipe.createWritablePipe(channel, event);
                let ipcEvent = new IPCEvent(writablePipe, data.message);
                listener(new PipeNotification(channel, ipcEvent, data.message));
                return true;
            }
            return false;
        };

    }

    static createWritablePipe(channel: string, event: any) {

        return WritablePipes.createFromFunction((channel, message: any) => {
            event.sender.postMessage( {channel, message}, '*');
        });

    }

}

interface WindowMessageListener {

    /**
     * Handle an event and return true if we handled it. We only return true if
     * we are on the same channel.
     * @param event
     */
    (event: any): boolean;

}
