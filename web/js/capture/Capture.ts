import {Browser} from './Browser';
import {CaptureOpts} from './CaptureOpts';
import {shell, app, BrowserWindow, WebRequest} from 'electron';
import {CaptureResult} from './CaptureResult';
import {Logger} from '../logger/Logger';
import {Preconditions} from '../Preconditions';
import {BrowserWindows} from './BrowserWindows';
import {Dimensions, IDimensions} from '../util/Dimensions';
import {PendingWebRequestsListener} from '../webrequests/PendingWebRequestsListener';
import {DebugWebRequestsListener} from '../webrequests/DebugWebRequestsListener';
import {WebRequestReactor} from '../webrequests/WebRequestReactor';
import {configureBrowserWindowSize} from './renderer/ContentCaptureFunctions';

const {Filenames} = require("../util/Filenames");
const {Files} = require("../util/Files");
const {Functions} = require("../util/Functions");
const {CapturedPHZWriter} = require("./CapturedPHZWriter");
const {DefaultPagingBrowser} = require("../electron/capture/pagination/DefaultPagingBrowser");
const {PagingLoader} = require("../electron/capture/pagination/PagingLoader");

const log = Logger.create();

const USE_PAGING_LOADER = false;

/**
 * This is a hard coded delay to hold off capturing the content until the page
 * has finished executing all onLoad handlers. I need our own way to handle this
 * within the capture main process. Maybe I could add our own loader to the END
 * of the list and only run once our loader function finishes last.
 *
 * @type {number}
 */
const EXECUTE_CAPTURE_DELAY = 1500;

// TODO: this code is distributed across two packages.. capture and
// electron.capture... pick one!

export class Capture {

    public url: string;
    public readonly browser: Browser;
    public readonly stashDir: string;
    public readonly captureOpts: CaptureOpts;

    public readonly pendingWebRequestsListener: PendingWebRequestsListener;
    public readonly debugWebRequestsListener: DebugWebRequestsListener;

    public readonly webRequestReactors: WebRequestReactor[] = [];

    /**
     * The resolve function to call when we have completed .
     */
    public resolve: CaptureResultCallback = () => {};

    public window?: BrowserWindow;

    public windowConfigured = false;

    /**
     *
     */
    constructor(url: string, browser: Browser, stashDir: string, captureOpts: CaptureOpts = {amp: true}) {

        // FIXME: don't allow named anchors in the URL like #foo... strip them
        // and test this functionality.

        this.url = Preconditions.assertNotNull(url, "url");
        this.browser = Preconditions.assertNotNull(browser, "browser");
        this.stashDir = Preconditions.assertNotNull(stashDir, "stashDir");
        this.captureOpts = captureOpts;

        this.pendingWebRequestsListener = new PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener();

        if(captureOpts.pendingWebRequestsCallback) {
            this.pendingWebRequestsListener.addEventListener(captureOpts.pendingWebRequestsCallback);
        }

    }

    async start() {

        this.window = await this.createWindow();

        this.loadURL(this.url);

        return new Promise(resolve => {
            this.resolve = resolve;
        });

    }

    loadURL(url: string) {

        if(! this.window) {
            throw new Error("No window");
        }

        // change the global URL we're loading...
        this.url = url;

        const loadURLOptions = {

            // TODO: I don't think we should use no-cache or at least make it
            // a command line option. Probably best to not use it by default
            // but then make it an option later.

            extraHeaders: `pragma: no-cache\nreferer: ${url}\n`,
            userAgent: this.browser.userAgent

        };

        this.window.loadURL(url, loadURLOptions);

    }

    /**
     * Called when the onLoad handler is executed and we're ready to start the
     * capture.
     */
    async startCapture(window: BrowserWindow) {

        if(USE_PAGING_LOADER) {

            let pagingBrowser = new DefaultPagingBrowser(window.webContents);

            let pagingLoader = new PagingLoader(pagingBrowser, async () => {
                log.info("Paging loader finished.")
            } );

            // WARN: this was removed as part of the TS migration and would need
            // to be enabled if we want this to work again.
            //
            //this.pendingWebRequestsListener.addEventListener(pendingRequestEvent => {
            //    pagingLoader.onPendingRequestsUpdate(pendingRequestEvent);
            //});

            await pagingLoader.onLoad();

        }

        this.webRequestReactors.forEach(webRequestReactor => {
            log.info("Stopping webRequestReactor...");
            webRequestReactor.stop();
            log.info("Stopping webRequestReactor...done");
        });

        await Functions.waitFor(EXECUTE_CAPTURE_DELAY);

        this.executeContentCapture()
            .catch(err => log.error(err));

    }

    /**
     * See if the page has a rel=amphtml URL.
     *
     * @return {Promise<string>}
     */
    private async getAmpURL() {

        if(! this.window) {
            throw new Error("No window");
        }

        /** @RendererContext */
        function fetchAmpURL() {

            let link = <HTMLLinkElement>document.querySelector("link[rel='amphtml']");

            if(link) {
                return link.href;
            }

            return null;

        }

        return await this.window.webContents.executeJavaScript(Functions.functionToScript(fetchAmpURL));

    }

    async executeContentCapture() {

        // TODO: this function should be cleaned up a bit.. it has too many moving
        // parts now and should be moved into smaller functions.

        if(! this.window || ! this.window.webContents)
            throw new Error("No window");

        let window = this.window;
        let webContents = window.webContents;

        log.info("Capturing the HTML...");

        // define the content capture script.
        //log.info("Defining ContentCapture...");
        //console.log(ContentCapture.toString());
        //log.info("Defining ContentCapture...done");

        log.info("Retrieving HTML...");

        let captured;

        // TODO: I don't think executeJavascript actually handles exceptions
        // properly and they also suggest using the callback so we should test
        // this more aggressively.
        try {

            captured = await webContents.executeJavaScript("ContentCapture.captureHTML()");

        } catch (e) {

            // TODO: this isn't actually called because executeJavascript doesn't
            // handle exceptions. You just block there forever. I need to wrap
            // this with a closure that is an 'either' err or content.

            log.error("Could not capture HTML: ", e);

        }

        log.info("Retrieving HTML...done");

        // record the browser that was used to render this page.
        captured.browser = this.browser;

        let stashDir = this.stashDir;
        let filename = Filenames.sanitize(captured.title);

        // TODO convert the captured JSON to a phz file...

        let phzPath = `${stashDir}/${filename}.phz`;

        log.info("Writing PHZ to: " + phzPath);

        let capturedPHZWriter = new CapturedPHZWriter(phzPath);
        await capturedPHZWriter.convert(captured);

        // write the captured HTML to /tmp for debug purposes.  We can enable this
        // as a command line switch later.

        await Files.writeFileAsync(`/tmp/${filename}.json`, JSON.stringify(captured, null, "  "));

        log.info("Capturing the HTML...done");

        window.close();

        this.resolve(new CaptureResult({
            path: phzPath
        }));

    }

    /**
     * Called when we have a web request to listen to. Either the first one
     * or subsequent ones from iframes.
     *
     * @param webRequest
     */
    onWebRequest(webRequest: WebRequest) {

        let webRequestReactor = new WebRequestReactor(webRequest);
        webRequestReactor.start();

        this.webRequestReactors.push(webRequestReactor);

        //this.debugWebRequestsListener.register(webRequestReactor);
        this.pendingWebRequestsListener.register(webRequestReactor);

    }

    async createWindow() {

        // Create the browser window.
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(this.browser);

        log.info("Using browserWindowOptions: ", browserWindowOptions);

        let newWindow = new BrowserWindow(browserWindowOptions);

        // TODO: make this a command line argument
        //newWindow.webContents.toggleDevTools();

        this.onWebRequest(newWindow.webContents.session.webRequest);

        newWindow.webContents.on('dom-ready', function(e) {
            log.info("dom-ready: ", e);
        });

        newWindow.on('close', function(e) {
            e.preventDefault();
            newWindow.webContents.clearHistory();
            newWindow.webContents.session.clearCache(function() {
                newWindow.destroy();
            });
        });

        newWindow.on('closed', function() {

        });

        newWindow.webContents.on('new-window', function(e, url) {
        });

        newWindow.webContents.on('will-navigate', function(e, url) {
            e.preventDefault();
        });

        newWindow.once('ready-to-show', () => {
        });

        newWindow.webContents.on('did-fail-load', function(event, errorCode, errorDescription, validateURL, isMainFrame) {

            log.info("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);

            // FIXME: figure out how to fail properly and have unit tests
            // setup for this situation.

        });

        /**
         */
        newWindow.webContents.on('did-start-loading', (event: Electron.Event) => {

            log.info("Registering new webRequest listeners");

            // We get one webContents per frame so we have to listen to their
            // events too..

            /**
             * @type {Electron.WebContents}
             */
            let webContents = event.sender;

            log.info("Detected new loading page: " + webContents.getURL());

            if(! this.windowConfigured) {

                this.configureWindow(newWindow)
                    .catch(err => log.error(err));

                this.windowConfigured = true;

            }

        });

        newWindow.webContents.on('did-finish-load', async () => {

            log.info("did-finish-load: ", arguments);

            // see if we first need to handle the page in any special manner.

            let ampURL = await this.getAmpURL();

            // TODO: if we end up handling multiple types of URLs in the future
            // we might want to build up a history to prevent endless loops or
            // just keep track of the redirect count.
            if(this.captureOpts.amp && ampURL && ampURL !== this.url) {

                log.info("Found AMP URL.  Redirecting then loading: " + ampURL);

                // redirect us to the amp URL as this will render better.
                this.loadURL(ampURL);
                return;

            }

            setTimeout(() => {

                // capture within timeout just for debug purposes.

                if(! this.window) {
                    throw new Error("No window");
                }

                this.startCapture(this.window)
                    .catch(err => log.error(err));

            }, 1);

        });

        return newWindow;

    }

    async configureWindow(window: BrowserWindow) {

        // TODO maybe inject this via a preload script so we know that it's always
        // running

        log.info("Emulating browser: " + JSON.stringify(this.browser, null, "  " ));

        // we need to mute by default especially if the window is hidden.
        log.info("Muting audio...");
        window.webContents.setAudioMuted(true);

        /**
         * @type {Electron.Parameters}
         */
        let deviceEmulation = this.browser.deviceEmulation;

        deviceEmulation = Object.assign({}, deviceEmulation);

        log.info("Emulating device...");
        window.webContents.enableDeviceEmulation(deviceEmulation);

        window.webContents.setUserAgent(this.browser.userAgent);

        let windowDimensions: IDimensions = {
            width: deviceEmulation.screenSize.width,
            height: deviceEmulation.screenSize.height,
        };

        log.info("Using window dimensions: " + JSON.stringify(windowDimensions, null, "  "));

        let screenDimensionScript = Functions.functionToScript(configureBrowserWindowSize, windowDimensions);

        await window.webContents.executeJavaScript(screenDimensionScript);

    }

}

export interface CaptureResultCallback {
    (captureResult: CaptureResult): void;
}
