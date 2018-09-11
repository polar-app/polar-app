import WebContents = Electron.WebContents;
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {CaptureWebviewWebContentsDriver} from './CaptureWebviewWebContentsDriver';

export interface WebContentsDriver {

    init(): Promise<void>;

    getWebContents(): Promise<WebContents>;

    /**
     *
     */
    destroy(): void;

    loadURL(url: string): Promise<void>;

    /**
     * Called when progress for the loading page has been updated.
     */
    progressUpdated(event: PendingWebRequestsEvent): void;

    /**
     * Allows us to listen to close, etc.
     */
    addEventListener(eventName: WebContentsEventName, eventListener: () => void): void;

}

export class WebContentsDriverFactory {

    public static async create(browserProfile: BrowserProfile): Promise<WebContentsDriver> {

        let webContentsDriver: WebContentsDriver;

        if(browserProfile.profile === DriverType.WEBVIEW) {
            webContentsDriver = new CaptureWebviewWebContentsDriver(browserProfile);
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
