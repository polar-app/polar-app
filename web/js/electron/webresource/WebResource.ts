import BrowserWindow = Electron.BrowserWindow;
import WebContents = Electron.WebContents;
import {Logger} from '../../logger/Logger';
import fs from 'fs';

const log = Logger.create();

export abstract class WebResource {

    public abstract loadBrowserWindow(browserWindow: BrowserWindow): void;

    public abstract loadWebContents(webContents: WebContents): void;

    public static createFile(path: string): WebResource {
        return new FileWebResource(path);
    }

    public static createURL(url: string): WebResource {
        return new URLWebResource(url);
    }

}

export enum WebResourceType {
    FILE = "FILE",
    URL = "URL"
}

class FileWebResource extends WebResource {

    public readonly type = WebResourceType.FILE;
    public readonly file: string;

    constructor(file: string) {
        super();

        if(! fs.existsSync(file)) {
            throw new Error("File does not exist: " + file);
        }

        this.file = file;

    }

    loadBrowserWindow(browserWindow: BrowserWindow): void {
        browserWindow.loadFile(this.file);
    }

    loadWebContents(webContents: WebContents): void {
        log.info("Loading file: ", this.file);
        //webContents.loadFile(this.file);
        webContents.loadURL('file://' + this.file);
    }

    toString(): string {
        return `${this.type}: ${this.file}`;
    }

}

class URLWebResource extends WebResource {

    public readonly type = WebResourceType.URL;

    public readonly url: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    loadBrowserWindow(browserWindow: BrowserWindow): void {
        browserWindow.loadURL(this.url);
    }

    loadWebContents(webContents: WebContents): void {
        log.info("Loading URL: ", this.url);
        webContents.loadURL(this.url);
    }

    toString(): string {
        return `${this.type}: ${this.url}`;
    }

}
