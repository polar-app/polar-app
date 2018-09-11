import {BrowserWindow, WebContents} from 'electron';
import {WebContentsDriver, WebContentsEvent, WebContentsEventName} from './WebContentsDriver';
import {BrowserWindows} from '../BrowserWindows';
import {Logger} from '../../logger/Logger';
import {Optional} from '../../util/ts/Optional';
import {IDimensions} from '../../util/Dimensions';
import {configureBrowserWindowSize} from '../renderer/ContentCaptureFunctions';
import {Functions} from '../../util/Functions';
import {BrowserProfile} from '../BrowserProfile';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {Reactor} from '../../reactor/Reactor';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {WebContentsPromises} from '../../electron/framework/WebContentsPromises';

const log = Logger.create();

/**
 * Used by the hidden and headless driver.
 */
export class StandardWebContentsDriver implements WebContentsDriver {

    protected readonly browserProfile: BrowserProfile;

    protected window?: BrowserWindow;

    protected webContents?: WebContents;

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
        Optional.of(this.window).when(window => window.close());
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

    protected async initWebContents(window: BrowserWindow,
                                    webContents: WebContents,
                                    browserWindowOptions: BrowserWindowConstructorOptions) {

        this.window = window;
        this.webContents = webContents;

        webContents.on('dom-ready', function(e) {
            log.info("dom-ready: ", e);
        });

        window.on('close', () => {
            log.info("Window close");
        });

        window.on('closed', () => {
            log.info("Window closed");
        });

        webContents.on('new-window', (e, url) => {
        });

        webContents.on('will-navigate', (e, url) => {
            e.preventDefault();
        });

        webContents.on('did-fail-load', (event, errorCode, errorDescription, validateURL, isMainFrame) => {
            log.info("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);
        });

        // if a URL is NEVER loaded we never get ready-to-show show load
        // about:blank by default.
        webContents.loadURL('about:blank');

        if ( ! browserWindowOptions.show) {
            await BrowserWindows.onceReadyToShow(window);
        }

        await this.configureWindow(window.webContents);

    }

    protected async configureWindow(webContents: WebContents) {

        log.info("Emulating browser: ", this.browserProfile);

        // we need to mute by default especially if the window is hidden.
        log.info("Muting audio...");
        webContents.setAudioMuted(true);

        let deviceEmulation = this.browserProfile.deviceEmulation;

        deviceEmulation = Object.assign({}, deviceEmulation);

        log.info("Emulating device...");
        webContents.enableDeviceEmulation(deviceEmulation);

        webContents.setUserAgent(this.browserProfile.userAgent);

        const windowDimensions: IDimensions = {
            width: deviceEmulation.screenSize.width,
            height: deviceEmulation.screenSize.height,
        };

        log.info("Using window dimensions: ", windowDimensions);

        const screenDimensionScript = Functions.functionToScript(configureBrowserWindowSize, windowDimensions);

        await webContents.executeJavaScript(screenDimensionScript);

    }

    protected initReactor() {

        log.info("Initializing reactor for 'close'");

        this.reactor.registerEvent('close');

        this.window!.on('close', () => {
            log.info("Firing event listener 'close'");
            this.reactor.dispatchEvent('close', {});
        });

    }

}
