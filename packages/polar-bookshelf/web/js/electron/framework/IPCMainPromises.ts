import {ipcMain} from 'electron';

export class IPCMainPromises {

    public static async once<M>(channel: string): Promise<MainIPCEvent<M>> {

        return new Promise<MainIPCEvent<M>>((resolve) => {

            ipcMain.once(channel, (event: Electron.Event, message: M) => {
                resolve(new MainIPCEvent(event, message));
            });

        });

    }
    public static on<M>(channel: string, listener: MainIPCEventListener<M>) {

        ipcMain.on(channel, (event: Electron.Event, message: M) => {
            listener(new MainIPCEvent(event, message));
        });

    }


}

export interface MainIPCEventListener<M> {
    (event: MainIPCEvent<M>): void;
}

export class MainIPCEvent<M> {

    public readonly event: Electron.Event;
    public readonly message: M;

    constructor(event: any, message: M) {
        this.event = event;
        this.message = message;
    }

}
