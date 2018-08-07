import {ipcRenderer} from 'electron';
import {Pipe, PipeListener, PipeNotification} from './Pipe';

/**
 * Pipe that listens to events send to event send to the renderer.
 */
export class ElectronRendererPipe extends Pipe<Electron.Event, any> {

    on(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcRenderer.on(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(channel, event, message));
        });
    }

    once(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcRenderer.once(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(channel, event, message));
        });
    }

    write(channel: string, message: any): void {
        ipcRenderer.send(channel, message);
    }

}
