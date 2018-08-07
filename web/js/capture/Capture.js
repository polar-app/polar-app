
const electron = require('electron');
const debug = require('debug');
const CaptureResult = require("./CaptureResult").CaptureResult;

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;

const {CaptureOpts} = require("./CaptureOpts");

const {Preconditions} = require("../Preconditions");
const {Cmdline} = require("../electron/Cmdline");
const {Filenames} = require("../util/Filenames");
const {Files} = require("../util/Files");
const {Functions} = require("../util/Functions");
const {DiskDatastore} = require("../datastore/DiskDatastore");
const {Args} = require("../electron/capture/Args");
const {BrowserWindows} = require("./BrowserWindows");
const {WebRequestReactor} = require("../webrequests/WebRequestReactor");
const {CapturedPHZWriter} = require("./CapturedPHZWriter");
const {DefaultPagingBrowser} = require("../electron/capture/pagination/DefaultPagingBrowser");
const {PagingLoader} = require("../electron/capture/pagination/PagingLoader");
const Logger = require("../logger/Logger").Logger;
const {PendingWebRequestsListener} = require("../webrequests/PendingWebRequestsListener");
const {DebugWebRequestsListener} = require("../webrequests/DebugWebRequestsListener");
const {Dimensions} = require("../util/Dimensions");
const {Objects} = require("../util/Objects");

// TODO: this code is distributed across two packages.. capture and
// electron.capture... pick one!

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

// TODO: migrate this to use Electron offscreen rendering (like chrome headless)
//
// https://electronjs.org/docs/tutorial/offscreen-rendering

class Capture {

    /**
     *
     * @param url {string} The URL to capture.
     * @param browser {Browser}
     * @param stashDir {string}
     * @param captureOpts {CaptureOpts}
     */
    constructor(url, browser, stashDir, captureOpts = new CaptureOpts()) {

        // FIXME: don't allow named anchors in the URL like #foo... strip them
        // and test this functionality.

        this.url = Preconditions.assertNotNull(url, "url");
        this.browser = Preconditions.assertNotNull(browser, "browser");
        this.stashDir = Preconditions.assertNotNull(stashDir, "stashDir");
        this.captureOpts = captureOpts;

        /**
         * The resolve function to call when we have completed .
         *
         * @type {Function}
         */
        this.resolve = null;

        this.webRequestReactors = [];
        this.pendingWebRequestsListener = new PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener();


        if(captureOpts.pendingWebRequestsCallback) {
            this.pendingWebRequestsListener.addEventListener(captureOpts.pendingWebRequestsCallback);
        }

        /**
         * @type {Electron.BrowserWindow}
         */
        this.window = null;

        this.windowConfigured = false;

    }

    async execute() {

        this.window = await this.createWindow();

        this.loadURL(this.url);

        return new Promise(resolve => {
            this.resolve = resolve;
        });

    }

    loadURL(url) {

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
    async startCapture() {

        if(USE_PAGING_LOADER) {

            let pagingBrowser = new DefaultPagingBrowser(this.window.webContents);

            let pagingLoader = new PagingLoader(pagingBrowser, async () => {
                log.info("Paging loader finished.")
            } );

            this.pendingWebRequestsListener.addEventListener(pendingRequestEvent => {
                pagingLoader.onPendingRequestsUpdate(pendingRequestEvent);
            });

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
    async getAmpURL() {

        /** @RendererContext */
        function fetchAmpURL() {

            let link = document.querySelector("link[rel='amphtml']");

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

        Preconditions.assertNotNull(this.window);
        Preconditions.assertNotNull(this.window.webContents);

        let window = this.window;
        let webContents = this.window.webContents;

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
    onWebRequest(webRequest) {

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
        newWindow.toggleDevTools();

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
        newWindow.webContents.on('did-start-loading', (event) => {

            log.info("Registering new webRequest listeners");

            // We get one webContents per frame so we have to listen to their
            // events too..

            /**
             * @type {Electron.WebContents}
             */
            let webContents = event.sender.webContents;

            log.info("Detected new loading page: " + webContents.getURL());

            // FIXME: this might be a bug.  Just because we get a new start loading
            // request doesn't mean it's in a new webContents ...
            //this.onWebRequest(webContents.session.webRequest);

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

                this.startCapture()
                    .catch(err => log.error(err));

            }, 1);

        });

        return newWindow;

    }

    async configureWindow(window) {

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

        deviceEmulation = Objects.duplicate(deviceEmulation);

        log.info("Emulating device...");
        window.webContents.enableDeviceEmulation(deviceEmulation);

        window.webContents.setUserAgent(this.browser.userAgent);

        //let windowDimensions = this.__calculateWindowDimensions(window);

        let windowDimensions = {
            width: deviceEmulation.screenSize.width,
            height: deviceEmulation.screenSize.height,
        };

        log.info("Using window dimensions: " + JSON.stringify(windowDimensions, null, "  "));

        /** @RendererContext */
        function configureBrowserWindowSize(windowDimensions) {

            // TODO: see if I have already redefined it.  the second time fails
            // because I can't redefine a property.  I don't think there is a way
            // to find out if it's already defined though.

            let definitions = [
                {key: "width",       value: windowDimensions.width},
                {key: "availWidth",  value: windowDimensions.width},
                {key: "height",      value: windowDimensions.height},
                {key: "availHeight", value: windowDimensions.height}
            ];

            definitions.forEach((definition) => {

                console.log(`Defining ${definition.key} as: ${definition.value}`);

                try {
                    Object.defineProperty(window.screen, definition.key, {
                        get: function () {
                            return definition.value
                        }
                    });
                } catch(e) {
                    console.warn(`Unable to define ${definition.key}`, e);
                }

            });

        }

        let screenDimensionScript = Functions.functionToScript(configureBrowserWindowSize, windowDimensions);

        await window.webContents.executeJavaScript(screenDimensionScript);

    }

    /**
     * Get back the dimensions of the given window.
     *
     * @param window
     * @return {Dimensions}
     * @private
     */
    __calculateWindowDimensions(window) {

        let size = window.getSize();

        return new Dimensions({
            width: size[0],
            height: size[1]
        });

    }


}

module.exports.Capture = Capture;
