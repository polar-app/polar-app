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

    load(): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            this.didFinishLoad().then(() => resolve());

            this.didFailLoad().then((failLoad: FailLoad) => reject(failLoad));

        });

    }

    didFinishLoad(): Promise<void> {

        return new Promise<void>(resolve => {
            this.webContents.once('did-finish-load', () => {
                resolve();
            })
        });

    }

    didFailLoad(): Promise<FailLoad> {

        return new Promise<FailLoad>(resolve => {
            this.webContents.once('did-fail-load', (event: Event,
                                                    errorCode: number,
                                                    errorDescription: string,
                                                    validatedURL: string,
                                                    isMainFrame: boolean) => {

                // TODO: would be nice if there were a way to take method arguments
                // and make them an object.

                let failLoad = new FailLoad(event, errorCode, errorDescription, validatedURL, isMainFrame);
                resolve(failLoad);

            })

        });

    }

}

export class FailLoad {

    event: Event;
    errorCode: number;
    errorDescription: string;
    validatedURL: string;
    isMainFrame: boolean;

    constructor(event: Electron.Event, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean) {
        this.event = event;
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.validatedURL = validatedURL;
        this.isMainFrame = isMainFrame;
    }

}
