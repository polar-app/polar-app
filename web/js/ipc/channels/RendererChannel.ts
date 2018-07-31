import {ipcRenderer} from 'electron';
import {Channel, ChannelListener, ChannelNotification} from './Channel';

export class RendererChannel extends Channel<Electron.Event, any> {

    on(channel: string, listener: ChannelListener<Electron.Event, any>): void {
        ipcRenderer.on(channel, (event: Electron.Event, message: any) => {
            listener(new ChannelNotification(event, message));
        });
    }

    once(channel: string, listener: ChannelListener<Electron.Event, any>): void {
        ipcRenderer.once(channel, (event: Electron.Event, message: any) => {
            listener(new ChannelNotification(event, message));
        });
    }

    write(channel: string, message: any): void {
        ipcRenderer.send(channel, message);
    }

}
