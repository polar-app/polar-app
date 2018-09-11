import {ipcRenderer} from 'electron';

export class IPCRendererPromises {

    public static async once(channel: string): Promise<RendererEvent> {

        return new Promise<RendererEvent>((resolve) => {

            ipcRenderer.once(channel, (event: any, message: any) => {
                resolve(new RendererEvent(event, message));
            });

        });

    }

}

export class RendererEvent {

    public readonly event: any;
    public readonly message: any;

    constructor(event: any, message: any) {
        this.event = event;
        this.message = message;
    }

}
