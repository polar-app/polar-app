import {ipcRenderer} from 'electron';
import {Pipe, PipeListener, PipeNotification} from './Pipe';
import {WindowReference} from '../../ui/dialog_window/WindowReference';

/**
 * Pipe that communicates to BrowserWindow directly instead of the main process.
 */
export class ElectronRenderToRendererPipe extends Pipe<Electron.Event, any> {

    public readonly windowReference: WindowReference;

    constructor(windowReference: WindowReference) {
        super();
        this.windowReference = windowReference;
    }

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
        ipcRenderer.sendTo(this.windowReference.id, channel, message);
    }

}
