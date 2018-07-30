import {WebContents, Event} from 'electron';

export class WebContentsPromises {

    static once(webContents: WebContents): Once {

        return new Once(webContents);
    }

}

class Once {

    private readonly webContents: WebContents;

    constructor(webContents: WebContents) {
        this.webContents = webContents;
    }

    didFinishLoad(): Promise<void> {

        return new Promise<void>(resolve => {
            this.webContents.once('did-finish-load', () => {
                resolve();
            })
        });

    }

}
