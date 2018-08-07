import {BrowserWindow, ipcMain} from 'electron';
import {Pipe, PipeListener, PipeNotification} from './Pipe';

/**
 * Pipe that communicates to BrowserWindow directly instead of the main process.
 */
export class ElectronMainToBrowserWindowPipe extends Pipe<Electron.Event, any> {

    public readonly browserWindow: BrowserWindow;

    constructor(browserWindow: Electron.BrowserWindow) {
        super();
        this.browserWindow = browserWindow;
    }

    on(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcMain.on(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(channel, event, message));
        });
    }

    once(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcMain.once(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(channel, event, message));
        });
    }

    write(channel: string, message: any): void {
        this.browserWindow.webContents.send(channel, message);
    }

}
