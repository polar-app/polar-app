import {IBrowser} from './Browser';

export interface BrowserProfile extends IBrowser {

    /**
     * The name of this profile.
     */
    profile: string;

    /**
     *
     * True when the browser should be shown while we are capturing.
     */
    show: boolean;

    /**
     *
     * True when we should use the offscreen support in Electron.
     */
    offscreen: boolean;

    nodeIntegration: boolean;

    /**
     * If we already have a browser window open for this BrowserProfile just
     * use this when capturing the content.
     */
    webContentsId?: number;

}
