import {BrowserWindow, DownloadItem, WebContents} from 'electron';
import {WebContentsDriver, WebContentsEvent, WebContentsEventName} from './WebContentsDriver';
import {BrowserWindows} from '../BrowserWindows';
import {Logger} from '../../logger/Logger';
import {Optional} from '../../util/ts/Optional';
import {IDimensions} from '../../util/Dimensions';
import {configureBrowser} from '../renderer/ContentCaptureFunctions';
import {Functions} from '../../util/Functions';
import {BrowserProfile} from '../BrowserProfile';
import {Reactor} from '../../reactor/Reactor';
import {PendingWebRequestsEvent} from '../../webrequests/PendingWebRequestsListener';
import {WebContentsPromises} from '../../electron/framework/WebContentsPromises';
import {FilePaths} from '../../util/FilePaths';
import {ToasterMessages} from '../../ui/toaster/ToasterMessages';
import {ToasterMessageType} from '../../ui/toaster/Toaster';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import base = Mocha.reporters.base;
import {PDFImporter} from '../../apps/repository/importers/PDFImporter';
import {FileImportClient} from '../../apps/repository/FileImportClient';

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
     * which is the default since the old capture system was based on the
     *     browser loading event stream and we assumed the load event would
     *     mean the page was finished rendering - which is not really true.
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

        console.log("FIXME: here1901");

        webContents.session.on('will-download', (event: Event,
                                                 downloadItem: DownloadItem,
                                                 downloadWebContents: WebContents) => {

            const mimeType = downloadItem.getMimeType();

            if (mimeType !== 'application/pdf') {
                log.warn("Downloading PDF and unable to handle");
                return;
            }

            const basename = FilePaths.basename(downloadItem.getURL());
            const tmpPath = FilePaths.createTempName(basename);

            // FIXME: compute the path in the stash otherwise we're wasting IO
            // writing to two places... (unless we use a hard link).
            //
            // FIXME: use a tmpdir within stash and then move it when finished
            //
            log.info("Download PDF file to " + tmpPath);

            ToasterMessages.send({type: ToasterMessageType.INFO, message: "PDF download starting for " + basename});

            downloadItem.setSavePath(tmpPath);

            downloadItem.on('done', (event, state) => {

                const message = `PDF download ${state}!` + basename;

                switch (state) {

                    case 'completed':
                        ToasterMessages.send({type: ToasterMessageType.SUCCESS, message});
                        FileImportClient.send({files: [tmpPath]});

                        break;

                    case 'cancelled':
                        ToasterMessages.send({type: ToasterMessageType.WARNING, message});
                        break;

                    case  'interrupted':
                        ToasterMessages.send({type: ToasterMessageType.WARNING, message});
                        break;

                }

            });


            let rootWebContents = webContents;

            while (rootWebContents.hostWebContents) {
                rootWebContents = rootWebContents.hostWebContents;
            }

            const browserWindowID = rootWebContents.id;

            log.info("Getting BrowserWindow from ID: " + browserWindowID);

            const browserWindow = BrowserWindow.fromId(browserWindowID);
            browserWindow.close();

            // FIXME: focus the main app so that progress events are shown
            // there... as well as a Toaster that it's being download in the
            // background.

            // FIXME: we need an API that has the following features:

            // - show progress and also support background states
            // - API consisistent on whether we're in the viewer, main app, or
            //   main process (just always works)
            // - supports focusing the MainApp when necessary to show key events.
            // - supports a toaster popup in the main app.
            //
            // - MainAppContext.  FIXME: how does MainAppContext detect the
            // following states?
            //
            //    - renderer context but running within the correct app
            //    - renderer context but NOT running within the correct app
            //    - maybe ALWAYs go through the main proc?
            //
            //    ... possibly an API that allows me to send messags to windows
            //    with specific tags directly and does the handling of the
            //    delivery internally.

            // FIXME downloadItem.on('updated')

            // /**
            //  * The API is only available in session's will-download callback
            //  * function. If user doesn't set the save path via the API,
            //  * Electron will use the original routine to determine the save
            //  * path(Usually prompts a save dialog).
            //  */
            // setSavePath(path: string): void;

            log.info("Going to to download: ", downloadItem.getURL());
            console.log("FIXME: Going to to download: ", downloadItem.getURL());

        });



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
