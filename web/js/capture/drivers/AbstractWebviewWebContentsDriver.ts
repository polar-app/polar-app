import {Logger} from '../../logger/Logger';
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {notNull} from '../../Preconditions';
import {BrowserWindows} from '../BrowserWindows';
import {BrowserWindow} from "electron";
import {Functions} from '../../util/Functions';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {BrowserProfile} from '../BrowserProfile';
import {WebContentsNotifier} from '../../electron/web_contents_notifier/WebContentsNotifier';
import {MainIPCEvent} from '../../electron/framework/IPCMainPromises';
import {BrowserAppEvents} from '../../apps/browser/BrowserAppEvents';
import WebContents = Electron.WebContents;

const log = Logger.create();

/**
 * A driver which creates an app that uses a <webview> host control for our
 * content.
 */
export abstract class AbstractWebviewWebContentsDriver extends StandardWebContentsDriver {

    private readonly appPath: string;

    private browserWindow?: BrowserWindow;

    protected constructor(browserProfile: BrowserProfile, appPath: string) {
        super(browserProfile);
        this.appPath = appPath;
    }

    public async init() {

        await this.doInit();

        await this.doInitWebview();

    }

    protected async waitForWebview(): Promise<WebContents> {
        return new Promise<WebContents>(resolve => {
            this.window!.webContents.once('did-attach-webview', (event, webContents: WebContents) => {
                resolve(webContents);
            });
        });
    }


    public progressUpdated(event: PendingWebRequestsEvent): void {

    }

    /**
     * doInit method for creating the window which differs from the
     * StandardWebContentsDriver in that we have to have the parent window
     * a reasonably browser height and the webview content the ACTUAL height.
     */
    protected async doInit() {

        const browserWindowOptions = this.computeAdjustedBrowserWindowOptions();

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        this.browserWindow = new BrowserWindow(browserWindowOptions);

        WebContentsNotifier.on(this.browserWindow.webContents,
                               BrowserAppEvents.PROVIDE_URL,
                               (event: MainIPCEvent<string>) => {

            const link = event.message;

            log.info("Got link for navigation: " + link);
            this.browserProfile.navigation.navigated.dispatchEvent({link});

        });

        WebContentsNotifier.on(this.browserWindow.webContents,
                               BrowserAppEvents.TRIGGER_CAPTURE,
                               (event: MainIPCEvent<void>) => {

           log.info("Content was captured!");
           this.browserProfile.navigation.captured.dispatchEvent({});

        });

        await this.initWebContents(this.browserWindow, this.browserWindow.webContents, browserWindowOptions);

        this.initReactor();

    }

    protected async doInitWebview() {

        const browserWindowOptions = this.computeBrowserWindowOptions();

        const window = notNull(this.window);

        // ok... now the page isn't setup properly and we need to load the app
        // and then adjust the webview properly.

        const resourceURL = AppPaths.resource(this.appPath);

        window.loadURL(resourceURL);

        this.webContents = await this.waitForWebview();

        await this.configureWindow(this.webContents);

        await this.doInitWebviewHeight(browserWindowOptions);

        // FIXME: Defining width as: undefined

    }

    protected computeAdjustedBrowserWindowOptions() {

        // Create the browser window.
        const browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        browserWindowOptions.height = Math.round(notNull(browserWindowOptions.width) * (11 / 8.5));
        browserWindowOptions.minHeight = browserWindowOptions.height;

        // TODO: make this part of the profile.
        browserWindowOptions.enableLargerThanScreen = false;
        // browserWindowOptions.webPreferences!.zoomFactor = 1.0

        return browserWindowOptions;

    }

    protected getBrowserWindow(): BrowserWindow | undefined {
        return this.browserWindow;
    }

    private async doInitWebviewHeight(browserWindowOptions: Electron.BrowserWindowConstructorOptions) {

        const window = notNull(this.window);

        // @ElectronRendererContext
        function setWebviewHeight(browserWindowOptions: Electron.BrowserWindowConstructorOptions) {

            const querySelector = <HTMLElement> document.querySelector('webview')!;

            console.log("browserWindowOptions: ", browserWindowOptions);

            console.log("Webview height before: ", querySelector.style.height);
            querySelector.style.height = `${browserWindowOptions.height}px`;
            console.log("Webview height after: ", querySelector.style.height);

        }

        await window.webContents.executeJavaScript(Functions.functionToScript(setWebviewHeight, browserWindowOptions));

    }

}
