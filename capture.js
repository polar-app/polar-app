// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs');
const electron = require('electron');
const debug = require('debug');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const {ContentCapture} = require("./web/js/capture/ContentCapture");
const {Preconditions} = require("./web/js/Preconditions");
const {Cmdline} = require("./web/js/electron/Cmdline");
const {Filenames} = require("./web/js/util/Filenames");
const {Functions} = require("./web/js/util/Functions");
const {DiskDatastore} = require("./web/js/datastore/DiskDatastore");
const {Args} = require("./web/js/electron/capture/Args");
const {BrowserWindows} = require("./web/js/capture/BrowserWindows");
const Browsers = require("./web/js/capture/Browsers");
const {WebRequestReactor} = require("./web/js/webrequests/WebRequestReactor");
const {CapturedPHZWriter} = require("./web/js/capture/CapturedPHZWriter");
const {DefaultPagingBrowser} = require("./web/js/electron/capture/pagination/DefaultPagingBrowser");
const {PagingLoader} = require("./web/js/electron/capture/pagination/PagingLoader");
const Logger = require("./web/js/logger/Logger").Logger;
const {PendingWebRequestsListener} = require("./web/js/webrequests/PendingWebRequestsListener");
const {DebugWebRequestsListener} = require("./web/js/webrequests/DebugWebRequestsListener");
const {Dimensions} = require("./web/js/util/Dimensions");

const log = Logger.create();

const USE_PAGING_LOADER = true;

async function configureBrowser(window) {

    // TODO maybe inject this via a preload script so we know that it's always
    // running

    log.info("Emulating browser: " + JSON.stringify(browser, null, "  " ));

    // we need to mute by default especially if the window is hidden.
    log.info("Muting audio...");
    window.webContents.setAudioMuted(true);

    log.info("Emulating device...");
    window.webContents.enableDeviceEmulation(browser.deviceEmulation);

    window.webContents.setUserAgent(browser.userAgent);

    let windowDimensions = calculateWindowDimensions(window);

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

function calculateWindowDimensions(window) {

    let size = window.getSize();

    return new Dimensions({
        width: size[0],
        height: size[1]
    });

}

let diskDatastore = new DiskDatastore();

let args = Args.parse(process.argv);

let browser = Browsers[args.browser];

if(! browser) {
    throw new Error("No browser defined for: " + args.browser);
}

class Capture {

    constructor(url) {

        this.url = url;

        this.webRequestReactors = [];
        this.pendingWebRequestsListener = new PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener();

        /**
         * @type {Electron.BrowserWindow}
         */
        this.window = null;

        this.windowConfigured = false;

    }

    async execute() {

        this.window = await this.createWindow();

        const loadURLOptions = {

            // TODO: I don't think we should use no-cache or at least make it
            // a command line option. Probably best to not use it by default
            // but then make it an option later.

            extraHeaders: `pragma: no-cache\nreferer: ${this.url}\n`,
            userAgent: browser.userAgent

        };

        this.window.loadURL(this.url, loadURLOptions);

    }

    /**
     * Called when the onLoad handler is executed and we're ready to start the
     * capture.
     */
    async startCapture() {

        let pagingBrowser = new DefaultPagingBrowser(this.window.webContents);

        if(USE_PAGING_LOADER) {

            let pagingLoader = new PagingLoader(pagingBrowser, async () => {

                // TODO: use the promise version of setTimeout in Functions.

                setTimeout(() => {

                    // capture within timeout just for debug purposes.  This way
                    // we can let the page continue loading for some time if
                    // there are any straggling resources.

                    this.webRequestReactors.forEach(webRequestReactor => {
                        log.info("Stopping webRequestReactor...");
                        webRequestReactor.stop();
                        log.info("Stopping webRequestReactor...done");
                    });

                    this.executeContentCapture(this.url, this.window)
                        .catch(err => log.error(err));

                }, 1);

            } );

            this.pendingWebRequestsListener.addEventListener(pendingRequestEvent => {
                pagingLoader.onPendingRequestsUpdate(pendingRequestEvent);
            });

            await pagingLoader.onLoad();

        } else {

            await this.executeContentCapture(this.url, this.window)

        }

    }

    async executeContentCapture(url, window) {

        // TODO: this function should be cleaned up a bit.. it has too many moving
        // parts now.

        Preconditions.assertNotNull(window);
        Preconditions.assertNotNull(window.webContents);

        log.info("Capturing the HTML...");

        // define the content capture script.
        log.info("Defining ContentCapture...");
        await window.webContents.executeJavaScript(ContentCapture.toString());

        log.info("Retrieving HTML...");
        // FIXME: it's locking up here.. not sure why...

        let captured;

        try {

            captured = await window.webContents.executeJavaScript("ContentCapture.captureHTML()");

        } catch (e) {

            // TODO: this isn't actually called because executeJavascript doesn't
            // handle exceptions. You just block there forever. I need to wrap
            // this with a closure that is an 'either' err or content.

            log.err("Could not capture HTML: ", e);

        }

        log.info("Retrieving HTML...done");

        // record the browser that was used to render this page.
        captured.browser = browser;

        let stashDir = diskDatastore.stashDir;
        let filename = Filenames.sanitize(captured.title);

        // TODO convert the captured JSON to a phz file...

        let phzPath = `${stashDir}/${filename}.phz`;

        log.info("Writing PHZ to: " + phzPath);

        let capturedPHZWriter = new CapturedPHZWriter(phzPath);
        await capturedPHZWriter.convert(captured)

        // write the captured HTML to /tmp for debug purposes.  We can enable this
        // as a command line switch later.

        fs.writeFile(`/tmp/${filename}.json`, JSON.stringify(captured, null, "  "));

        log.info("Capturing the HTML...done");

        if(args.quit) {
            log.info("Capture finished.  Quitting now");
            app.quit();
        } else {
            log.info("Not quitting (yielding to --no-quit=true).")
        }

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
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(browser);

        debug("Using browserWindowOptions: " + browserWindowOptions);

        let newWindow = new BrowserWindow(browserWindowOptions);

        // TODO: make this a command line argument
        //newWindow.toggleDevTools();

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

            if(BrowserWindow.getAllWindows().length === 0) {
                // determine if we need to quit:
                log.info("No windows left. Quitting app.");
                app.quit();

            }

        });

        newWindow.webContents.on('new-window', function(e, url) {
            e.preventDefault();
            shell.openExternal(url);
        });

        newWindow.webContents.on('will-navigate', function(e, url) {
            e.preventDefault();
            shell.openExternal(url);
        });

        newWindow.once('ready-to-show', () => {
            //newWindow.maximize();
            //newWindow.show();

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
            this.onWebRequest(webContents.session.webRequest);

            if(! this.windowConfigured) {

                configureBrowser(newWindow)
                    .catch(err => log.error(err));

                this.windowConfigured = true;

            }

        });

        newWindow.webContents.on('did-finish-load', () => {
            log.info("did-finish-load: ", arguments);

            setTimeout(() => {

                // capture within timeout just for debug purposes.

                this.startCapture()
                    .catch(err => log.error(err));

            }, 1);

        });

        return newWindow;

    }

}

app.on('ready', function() {

    (async () => {

        await diskDatastore.init();

        // TODO don't use directory logging now as it is broken.
        //await Logger.init(diskDatastore.logsDir);

        let url = Cmdline.getURLArg(process.argv);

        if(! url) {
            throw new Error("URL required");
        }

        let capture = new Capture(url);

        await capture.execute();

    })().catch(err => log.error(err));

});
