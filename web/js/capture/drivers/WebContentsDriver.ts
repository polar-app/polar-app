import WebContents = Electron.WebContents;
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';
import {WebviewWebContentsDriver} from './WebviewWebContentsDriver';

export interface WebContentsDriver {

    init(): Promise<void>;

    getWebContents(): Promise<WebContents>;

    /**
     *
     */
    destroy(): void;

    loadURL(url: string): Promise<void>

    addEventListener(eventName: WebContentsEventName, eventListener: () => void): void;

}

export class WebContentsDriverFactory {

    static async create(browserProfile: BrowserProfile): Promise<WebContentsDriver> {

        let webContentsDriver: WebContentsDriver;

        if(browserProfile.profile === DriverType.WEBVIEW) {
            webContentsDriver = new WebviewWebContentsDriver(browserProfile);
        } else {
            webContentsDriver = new StandardWebContentsDriver(browserProfile);
        }

        await webContentsDriver.init();
        return webContentsDriver;
    }

}

export enum DriverType {
    HEADLESS = 'headless',
    HIDDEN = 'hidden',
    WEBVIEW = 'webview'
}

export type WebContentsEventName = 'close';

export interface WebContentsEvent {

}
