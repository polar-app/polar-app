import {Logger} from '../../logger/Logger';
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {notNull} from '../../Preconditions';
import WebContents = Electron.WebContents;
import {BrowserWindows} from '../BrowserWindows';
import {BrowserWindow} from "electron";
import {Promises} from '../../util/Promises';

const log = Logger.create();

/**
 * A driver which creates an app that uses a <webview> host control for our
 * content.
 */
export class WebviewWebContentsDriver extends StandardWebContentsDriver {

    public async init() {

        await this.doInit();

        await this.doInitWebview();

    }

    /**
     * doInit method for creating the window which differs from the
     * StandardWebContentsDriver in that we have to have the parent window
     * a reasonably browser height and the webview content the ACTUAL height.
     */
    protected async doInit() {

        // Create the browser window.
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        browserWindowOptions.height = Math.round(notNull(browserWindowOptions.width) * (11/8.5));

        // TODO: make this part of the profile.
        browserWindowOptions.enableLargerThanScreen = false;

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        // FIXME: set the height of the internal webView

        let window = new BrowserWindow(browserWindowOptions);

        await this.initWebContents(window, window.webContents, browserWindowOptions);

    }

    protected async doInitWebview() {

        // ok... now the page isn't setup properly and we need to load the app
        // and then adjust the webview properly.

        let resourceURL = AppPaths.resource("./apps/capture-webview/index.html");

        notNull(this.window).loadURL(resourceURL);

        this.webContents = await this.waitForWebview();

        await this.configureWindow(this.webContents);

    }

    public async waitForWebview(): Promise<WebContents> {
        return new Promise<WebContents>(resolve => {
            this.window!.webContents.once('did-attach-webview', (event, webContents: WebContents) => {
                resolve(webContents);
            });
        });
    }

}
