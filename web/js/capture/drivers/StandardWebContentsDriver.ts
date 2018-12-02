import {BrowserWindow, WebContents} from 'electron';
import {WebContentsDriver, WebContentsEvent, WebContentsEventName} from './WebContentsDriver';
import {BrowserWindows} from '../BrowserWindows';
import {Logger} from '../../logger/Logger';
import {Optional} from '../../util/ts/Optional';
import {IDimensions} from '../../util/Dimensions';
import {configureBrowser} from '../renderer/ContentCaptureFunctions';
import {Functions} from '../../util/Functions';
import {BrowserProfile} from '../BrowserProfile';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {Reactor} from '../../reactor/Reactor';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {WebContentsPromises} from '../../electron/framework/WebContentsPromises';
import {Browser} from '../Browser';

const log = Logger.create();

/**
 * Used by the hidden and headless driver.
 */
export class StandardWebContentsDriver implements WebContentsDriver {

    public webContents?: WebContents;

    public browserProfile: BrowserProfile;

    protected browserWindow?: BrowserWindow;

    protected reactor = new Reactor<WebContentsEvent>();

    constructor(browserProfile: BrowserProfile) {
        this.browserProfile = browserProfile;
    }

    public async init(webContents?: WebContents) {

        const browserWindowOptions = this.computeBrowserWindowOptions();

        await this.doInit(browserWindowOptions);

    }


    public async getWebContents(): Promise<Electron.WebContents> {
        return Optional.of(this.webContents).get();
    }

    public async destroy() {
        log.info("Destroying window...");
        Optional.of(this.browserWindow).when(window => window.close());
        log.info("Destroying window...done");
    }

    /**
     *
     * @param url The URL to load.
     *
     * @param waitForFinishLoad When true, wait for the 'did-finish-load' event
     * which is the default since the old capture system was based on the browser
     * loading event stream and we assumed the load event would mean the page
     * was finished rendering - which is not really true.
     */
    public async loadURL(url: string, waitForFinishLoad: boolean = true): Promise<void> {

        const opts = {

            // TODO: remove the no-cache or at least make it into a configurable
            // TODO: make the referer something the user can set in the UI
            extraHeaders: `pragma: no-cache\nreferer: ${url}\n`,
            userAgent: this.browserProfile.userAgent

        };

        const result = WebContentsPromises.once(this.webContents!).didFinishLoad();

        this.webContents!.loadURL(url, opts);

        if (waitForFinishLoad) {
            return result;
        } else {
            return Promise.resolve();
        }

    }

    public progressUpdated(event: PendingWebRequestsEvent): void {
    }

    public addEventListener(eventName: WebContentsEventName, eventListener: () => void): void {
        this.reactor.addEventListener(eventName, eventListener);
    }

    protected computeBrowserWindowOptions() {
        return BrowserWindows.toBrowserWindowOptions(this.browserProfile);
    }

    protected async doInit(browserWindowOptions: BrowserWindowConstructorOptions) {

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        const window = new BrowserWindow(browserWindowOptions);

        await this.initWebContents(window, window.webContents, browserWindowOptions);

        this.initReactor();

    }

    protected async initWebContents(browserWindow: BrowserWindow,
                                    webContents: WebContents,
                                    browserWindowOptions: BrowserWindowConstructorOptions) {

        this.browserWindow = browserWindow;
        this.webContents = webContents;

        await this.initWebContentsEvents(webContents);

        if ( ! browserWindowOptions.show) {
            await BrowserWindows.onceReadyToShow(browserWindow);
        }

        await StandardWebContentsDriver.configureWebContents(webContents, this.browserProfile);

    }

    private async initWebContentsEvents(webContents: WebContents) {

        webContents.on('dom-ready', (e) => {

            log.info("dom-ready: ", e);

            StandardWebContentsDriver.configureWebContents(webContents, this.browserProfile)
                .catch((err: Error) => log.error("Could not configure web contents: ", err));

        });

        webContents.on('will-navigate', (e, url) => {
            // log.info("Canceling navigation...");
            // e.preventDefault();
        });

        webContents.on('did-fail-load', (event, errorCode, errorDescription, validateURL, isMainFrame) => {
            log.info("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);
        });

    }

    public static async configureWebContents(webContents: WebContents, browserProfile: BrowserProfile) {

        // FIXME: the problem is now I'm not sure which browser we are cnofiguring...
        // I don't think we are configuring teh proper webContents and additionally
        // we're not reconfiguring it when it's changing navigation...

        const url = webContents.getURL();

        log.info("Configuring webContents with URL: " + url);

        // we need to mute by default especially if the window is hidden.
        log.info("Muting audio...");
        webContents.setAudioMuted(! browserProfile.webaudio);

        let deviceEmulation = browserProfile.deviceEmulation;

        deviceEmulation = Object.assign({}, deviceEmulation);

        log.info("Emulating device...");
        webContents.enableDeviceEmulation(deviceEmulation);

        webContents.setUserAgent(browserProfile.userAgent);

        const windowDimensions: IDimensions = {
            width: deviceEmulation.screenSize.width,
            height: deviceEmulation.screenSize.height,
        };

        log.info("Using window dimensions: ", windowDimensions);

        const configureBrowserScript = Functions.functionToScript(configureBrowser, windowDimensions);

        await webContents.executeJavaScript(configureBrowserScript);

    }

    protected initReactor() {

        log.info("Initializing reactor for 'close'");

        this.reactor.registerEvent('close');

        this.browserWindow!.on('close', () => {
            log.info("Firing event listener 'close'");
            this.reactor.dispatchEvent('close', {});
        });

    }

}
