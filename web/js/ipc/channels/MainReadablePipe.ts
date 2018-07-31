import {ipcMain} from 'electron';
import {Pipe, PipeListener, PipeNotification, ReadablePipe, when} from './Pipe';

export class MainReadablePipe implements ReadablePipe<Electron.Event, any> {

    on(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcMain.on(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(event, message));
        });
    }

    once(channel: string, listener: PipeListener<Electron.Event, any>): void {
        ipcMain.once(channel, (event: Electron.Event, message: any) => {
            listener(new PipeNotification(event, message));
        });
    }

    when(channel: string): Promise<PipeNotification<Electron.Event, any>> {
        return when(this, channel);
    }

}
