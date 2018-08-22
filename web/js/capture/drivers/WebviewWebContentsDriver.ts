import {Logger} from '../../logger/Logger';
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {notNull} from '../../Preconditions';
import WebContents = Electron.WebContents;
import {BrowserWindows} from '../BrowserWindows';
import {BrowserWindow} from "electron";
import {Promises} from '../../util/Promises';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {Functions} from '../../util/Functions';

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

        let browserWindowOptions = this.computeAdjustedBrowserWindowOptions();

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        let window = new BrowserWindow(browserWindowOptions);

        await this.initWebContents(window, window.webContents, browserWindowOptions);

        this.initReactor();

    }

    protected async doInitWebview() {

        let browserWindowOptions = this.computeBrowserWindowOptions();

        let window = notNull(this.window);

        // ok... now the page isn't setup properly and we need to load the app
        // and then adjust the webview properly.

        let resourceURL = AppPaths.resource("./apps/capture-webview/index.html");

        window.loadURL(resourceURL);

        this.webContents = await this.waitForWebview();

        await this.configureWindow(this.webContents);

        await this.doInitWebviewHeight(browserWindowOptions);

        // FIXME: Defining width as: undefined

    }

    private async doInitWebviewHeight(browserWindowOptions: BrowserWindowConstructorOptions) {

        let window = notNull(this.window);

        function setWebviewHeight(browserWindowOptions: BrowserWindowConstructorOptions) {

            let querySelector = <HTMLElement>document.querySelector('webview')!;

            console.log("browserWindowOptions: ", browserWindowOptions);

            console.log("Webview height before: ", querySelector.style.height);
            querySelector.style.height = `${browserWindowOptions.height}px`;
            console.log("Webview height after: ", querySelector.style.height);

        }

        await window.webContents.executeJavaScript(Functions.functionToScript(setWebviewHeight, browserWindowOptions));

    }

    public async waitForWebview(): Promise<WebContents> {
        return new Promise<WebContents>(resolve => {
            this.window!.webContents.once('did-attach-webview', (event, webContents: WebContents) => {
                resolve(webContents);
            });
        });
    }

    protected computeAdjustedBrowserWindowOptions() {

        // Create the browser window.
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        browserWindowOptions.height = Math.round(notNull(browserWindowOptions.width) * (11/8.5));
        browserWindowOptions.minHeight = browserWindowOptions.height;

        // TODO: make this part of the profile.
        browserWindowOptions.enableLargerThanScreen = false;

        return browserWindowOptions;

    }

}
