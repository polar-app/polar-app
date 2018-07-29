import {BrowserWindow} from "electron";

const BROWSER_WINDOW_OPTIONS = {
    backgroundColor: '#FFF',
    width: 800,
    height: 600,
    webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        defaultEncoding: 'UTF-8'
    }
};

export class DialogWindow {

    public readonly window: BrowserWindow;

    constructor(window: Electron.BrowserWindow) {
        this.window = window;
    }

    static create(options: DialogWindowOptions) {

        let browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

        // browserWindowOptions.width = options.width;
        // browserWindowOptions.height = options.height;

        // Create the browser window.
        let window = new BrowserWindow(BROWSER_WINDOW_OPTIONS);

        window.webContents.on('new-window', function(e, url) {
            e.preventDefault();
        });

        window.webContents.on('will-navigate', function(e, url) {
            e.preventDefault();
        });

        switch (options.resource.type) {
            case ResourceType.FILE:
                window.loadFile(options.resource.value);
                break;
            case ResourceType.URL:
                window.loadURL(options.resource.value, {});
                break;
        }

        window.once('ready-to-show', () => {
            window.show();
        });

        window.setMenu(null);

        return new DialogWindow(window);

    }

}

export enum ResourceType {
    FILE,
    URL
}

export class Resource {

    public readonly type: ResourceType;
    public readonly value: string;

    constructor(type: ResourceType, value: string) {
        this.type = type;
        this.value = value;
    }

}

export class DialogWindowOptions {

    public readonly resource: Resource;

    public readonly width?: number = 800;

    public readonly height?: number = 600;

    constructor(resource: Resource, width?: number, height?: number) {
        this.resource = resource;
        this.width = width;
        this.height = height;
    }

}

