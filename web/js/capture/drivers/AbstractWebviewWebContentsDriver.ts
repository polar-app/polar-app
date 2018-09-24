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
import {Browser} from '../Browser';
import WebContents = Electron.WebContents;

const log = Logger.create();

/**
 * A driver which creates an app that uses a <webview> host control for our
 * content.
 */
export abstract class AbstractWebviewWebContentsDriver extends StandardWebContentsDriver {

    private readonly appPath: string;

    private browserWindow?: BrowserWindow;

    private browserWindowOptions?: Electron.BrowserWindowConstructorOptions;

    private browserView?: BrowserView;

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

        this.browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        const hostBrowserWindowOptions = this.computeHostBrowserWindowOptions();

        log.info("Using hostBrowserWindowOptions: ", hostBrowserWindowOptions);

        this.browserWindow = new BrowserWindow(hostBrowserWindowOptions);

        const hostBrowserView = new HostBrowserView(this, this.browserWindow);
        const guestBrowserView = new GuestBrowserView(this, this.browserWindow);

        this.browserView =
            new DelegatedBrowserView([hostBrowserView, guestBrowserView]);

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

        WebContentsNotifier.on(this.browserWindow.webContents,
                               BrowserAppEvents.CONFIGURE_WINDOW,
                               (event: MainIPCEvent<Browser>) => {

            const browser = event.message;

            this.browserProfile = Object.assign({}, this.browserProfile, browser);
            this.browserWindowOptions = this.computeHostBrowserWindowOptions();

            log.info("Changing browser profile to: ", browser);


            this.browserView!.configure(this.browserProfile)
                   .catch((err: Error) => log.error("Unable to configure: ", err));

        });


        await this.initWebContents(this.browserWindow,
                                   this.browserWindow.webContents,
                                   this.browserWindowOptions);

        // await this.browserView.configure(this.browserProfile);

        this.initReactor();

    }

    protected async handleConfigureWindow() {

        log.info("Changing browser profile to: ", this.browserProfile);

        await this.configureWebContents(this.webContents!);
        await this.doInitGuestWebviewDimensions();

    }

    protected async doInitWebview() {

        const window = notNull(this.window);

        // ok... now the page isn't setup properly and we need to load the app
        // and then adjust the webview properly.

        const resourceURL = AppPaths.resource(this.appPath);

        window.loadURL(resourceURL);

        this.webContents = await this.waitForWebview();

        // FIXME: this configures the host
        await this.configureWebContents(this.webContents);

        await this.doInitGuestWebviewDimensions();

    }

    protected computeHostBrowserWindowOptions() {

        // Create the browser window.
        const browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        if (this.browserProfile.hosted) {
            // increase our hosted browser slightly
            browserWindowOptions.width = notNull(browserWindowOptions.width) * 1.35;
        }

        browserWindowOptions.height = Math.round(notNull(browserWindowOptions.width) * (11 / 8.5));
        browserWindowOptions.minHeight = (browserWindowOptions.height / 2);

        // TODO: make this part of the profile.
        browserWindowOptions.enableLargerThanScreen = false;
        // browserWindowOptions.webPreferences!.zoomFactor = 1.0

        return browserWindowOptions;

    }

    protected getBrowserWindow(): BrowserWindow | undefined {
        return this.browserWindow;
    }

    private async doInitGuestWebviewDimensions() {

        const window = notNull(this.window);

        // @ElectronRendererContext
        // noinspection TsLint: no-shadowed-variable
        function setWebviewDimensions(browserWindowOptions: Electron.BrowserWindowConstructorOptions) {

            const querySelector = <HTMLElement> document.querySelector('webview')!;

            // console.log("browserWindowOptions: ", browserWindowOptions);

            // console.log("Webview height before: ", querySelector.style.height);

            querySelector.style.height = `${browserWindowOptions.height}px`;
            querySelector.style.width = `${browserWindowOptions.width}px`;

            // console.log("Webview height after: ", querySelector.style.height);

        }

        await window.webContents.executeJavaScript(Functions.functionToScript(setWebviewDimensions, this.browserWindowOptions));

    }

}

interface BrowserView {
    configure(browserProfile: BrowserProfile): Promise<void>;
}

class DelegatedBrowserView implements BrowserView {

    private readonly delegates: BrowserView[];

    constructor(delegates: BrowserView[]) {
        this.delegates = delegates;
    }

    public async configure(browserProfile: BrowserProfile): Promise<void> {

        for (const delegate of this.delegates) {
            await delegate.configure(browserProfile);
        }

    }

}

class HostBrowserView implements BrowserView {

    private readonly driver: AbstractWebviewWebContentsDriver;
    private readonly window: BrowserWindow;

    private browserProfile?: BrowserProfile;
    private browserWindowOptions?: Electron.BrowserWindowConstructorOptions;

    constructor(driver: AbstractWebviewWebContentsDriver,
                window: Electron.BrowserWindow) {
        this.driver = driver;
        this.window = window;

    }

    public async configure(browserProfile: BrowserProfile) {

        this.browserProfile = browserProfile;
        this.browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile!);

        await this.doInitGuestWebviewDimensions();
    }

    /**
     * This configures the <webview> element width and height properly.
     */
    private async doInitGuestWebviewDimensions() {

        const window = notNull(this.window);

        // @ElectronRendererContext
        // noinspection TsLint: no-shadowed-variable
        function setWebviewDimensions(browserWindowOptions: Electron.BrowserWindowConstructorOptions) {

            const querySelector = <HTMLElement> document.querySelector('webview')!;

            // console.log("browserWindowOptions: ", browserWindowOptions);

            // console.log("Webview height before: ", querySelector.style.height);

            querySelector.style.height = `${browserWindowOptions.height}px`;
            querySelector.style.width = `${browserWindowOptions.width}px`;

            // console.log("Webview height after: ", querySelector.style.height);

        }

        const script = Functions.functionToScript(setWebviewDimensions, this.browserWindowOptions);

        await this.window.webContents.executeJavaScript(script);

    }

}

class GuestBrowserView implements BrowserView {

    private readonly driver: AbstractWebviewWebContentsDriver;
    private readonly window: BrowserWindow;

    private browserProfile?: BrowserProfile;
    private browserWindowOptions?: Electron.BrowserWindowConstructorOptions;

    constructor(driver: AbstractWebviewWebContentsDriver,
                window: Electron.BrowserWindow) {
        this.driver = driver;
        this.window = window;
    }

    public async configure(browserProfile: BrowserProfile) {
        this.browserProfile = browserProfile;
        this.browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile!);

        // this configures the guest web contents which loads the website we're
        // capturing and tells it about browser emulation, width, etc.
        await this.driver.configureWebContents(this.driver.webContents!);

    }

}
