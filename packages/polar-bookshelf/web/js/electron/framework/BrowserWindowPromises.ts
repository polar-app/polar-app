import {BrowserWindow} from 'electron';


export class BrowserWindowPromises {

    public static once(browserWindow: BrowserWindow): Once {
        return new Once(browserWindow);
    }

}

class Once {

    private readonly browserWindow: BrowserWindow;

    constructor(browserWindow: BrowserWindow) {
        this.browserWindow = browserWindow;
    }

    public readyToShow(): Promise<void> {

        return new Promise<void>(resolve => {
            this.browserWindow.once('ready-to-show', () => {
                resolve();
            });
        });

    }

}
