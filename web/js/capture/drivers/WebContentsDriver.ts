import WebContents = Electron.WebContents;
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';

export interface WebContentsDriver {

    getWebContents(): Promise<WebContents>;

    /**
     *
     */
    destroy(): void;

}

export class WebContentsDriverFactory {

    static async create(browserProfile: BrowserProfile): Promise<WebContentsDriver> {
        let standardWebContentsDriver = new StandardWebContentsDriver(browserProfile);
        await standardWebContentsDriver.init();
        return standardWebContentsDriver;
    }

}

export enum DriverType {
    HEADLESS = 'headless',
    HIDDEN = 'hidden',
    WEBVIEW = 'webview'
}
