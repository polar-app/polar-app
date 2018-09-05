import {ipcRenderer} from 'electron';
import {Pipe, PipeListener, PipeNotification} from './Pipe';
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';

/**
 * Pipe that communicates to BrowserWindow directly instead of the main process.
 */
export class ElectronRenderToRendererPipe extends Pipe<Electron.Event, any> {

    public readonly windowReference: BrowserWindowReference;

    constructor(windowReference: BrowserWindowReference) {
        super();
        this.windowReference = windowReference;
    }

    public on(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcRenderer.on(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(channel, event, message));
        });
    }

    public once(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcRenderer.once(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(channel, event, message));
        });
    }

    public write(channel: string, message: any): void {
        ipcRenderer.sendTo(this.windowReference.id, channel, message);
    }

}
