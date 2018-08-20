import {BrowserWindow, WebContents} from 'electron';
import {WebContentsDriver} from './WebContentsDriver';
import {BrowserWindows} from '../BrowserWindows';
import {Logger} from '../../logger/Logger';
import {Optional} from '../../util/ts/Optional';
import {IDimensions} from '../../util/Dimensions';
import {configureBrowserWindowSize} from '../renderer/ContentCaptureFunctions';
import {Functions} from '../../util/Functions';
import {BrowserProfile} from '../BrowserProfile';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

const log = Logger.create();

/**
 * Used by the hidden and headless driver.
 */
export class StandardWebContentsDriver implements WebContentsDriver {

    protected readonly browserProfile: BrowserProfile;

    protected window?: BrowserWindow;

    protected webContents?: WebContents;

    constructor(browserProfile: BrowserProfile) {
        this.browserProfile = browserProfile;
    }

    public async init() {

        // Create the browser window.
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browserProfile);

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        let window = new BrowserWindow(browserWindowOptions);

        await this.initWebContents(window, window.webContents, browserWindowOptions);

    }

    protected async initWebContents(window: BrowserWindow,
                                    webContents: WebContents,
                                    browserWindowOptions: BrowserWindowConstructorOptions) {

        this.window = window;
        this.webContents = webContents;

        webContents.on('dom-ready', function(e) {
            log.info("dom-ready: ", e);
        });

        this.window.on('close', (event) => {
            log.info("Handling window close");
            event.preventDefault();
            webContents.clearHistory();
            webContents.session.clearCache(function() {
                window.destroy();
            });
        });

        window.on('closed', function() {
            log.info("Window closed");
        });

        webContents.on('new-window', function(e, url) {
        });

        webContents.on('will-navigate', function(e, url) {
            e.preventDefault();
        });

        webContents.on('did-fail-load', (event, errorCode, errorDescription, validateURL, isMainFrame) => {
            log.info("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);
        });

        // if a URL is NEVER loaded we never get ready-to-show show load
        // about:blank by default.
        webContents.loadURL('about:blank');

        if( ! browserWindowOptions.show) {
            await BrowserWindows.onceReadyToShow(window);
        }

        this.configureWindow(window)
            .catch(err => log.error(err));

    }

    public async getWebContents(): Promise<Electron.WebContents> {
        return Optional.of(this.webContents).get();
    }

    public async destroy() {
        log.info("Destroying window...");
        Optional.of(this.window).when(window => window.close());
        log.info("Destroying window...done");
    }

    private async configureWindow(window: BrowserWindow) {

        log.info("Emulating browser: " + JSON.stringify(this.browserProfile, null, "  " ));

        // we need to mute by default especially if the window is hidden.
        log.info("Muting audio...");
        window.webContents.setAudioMuted(true);

        let deviceEmulation = this.browserProfile.deviceEmulation;

        deviceEmulation = Object.assign({}, deviceEmulation);

        log.info("Emulating device...");
        window.webContents.enableDeviceEmulation(deviceEmulation);

        window.webContents.setUserAgent(this.browserProfile.userAgent);

        let windowDimensions: IDimensions = {
            width: deviceEmulation.screenSize.width,
            height: deviceEmulation.screenSize.height,
        };

        log.info("Using window dimensions: " + JSON.stringify(windowDimensions, null, "  "));

        let screenDimensionScript = Functions.functionToScript(configureBrowserWindowSize, windowDimensions);


        await window.webContents.executeJavaScript(screenDimensionScript);

    }


}
