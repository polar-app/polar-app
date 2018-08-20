import WebContents = Electron.WebContents;
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {Browser} from '../Browser';

export interface WebContentsDriver {

    getWebContents(): Promise<WebContents>;

    /**
     *
     */
    destroy(): void;

}

export class WebContentsDriverFactory {

    static async create(browser: Browser): Promise<WebContentsDriver> {
        let standardWebContentsDriver = new StandardWebContentsDriver(browser);
        await standardWebContentsDriver.init();
        return standardWebContentsDriver;
    }

}

export enum DriverType {
    HEADLESS = 'headless',
    HIDDEN = 'hidden',
    WEBVIEW = 'webview'
}
