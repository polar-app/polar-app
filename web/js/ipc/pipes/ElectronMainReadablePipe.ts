import {ipcMain} from 'electron';
import {Pipe, PipeListener, PipeNotification, ReadablePipe} from './Pipe';
import {Pipes} from './Pipes';

export class ElectronMainReadablePipe implements Pipe<Electron.Event, any> {

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

    when(channel: string): Promise<PipeNotification<Electron.Event, any>> {
        return Pipes.when(this, channel);
    }

    write(channel: string, message: any): void {
        throw new Error("Not implemented");
    }

}
