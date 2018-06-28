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
const CapturedPHZWriter = require("./web/js/capture/CapturedPHZWriter").CapturedPHZWriter;
const DefaultPagingBrowser = require("./web/js/electron/capture/pagination/DefaultPagingBrowser").DefaultPagingBrowser;
const PagingLoader = require("./web/js/electron/capture/pagination/PagingLoader").PagingLoader;
const Logger = require("./web/js/logger/Logger").Logger;
const PendingWebRequestsListener = require("./web/js/webrequests/PendingWebRequestsListener").PendingWebRequestsListener;
const DebugWebRequestsListener = require("./web/js/webrequests/DebugWebRequestsListener").DebugWebRequestsListener;

const log = Logger.create();

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

    let windowSize = getWindowSize(window);

    function configureBrowserWindowSize(windowSize) {

        // TODO: see if I have already redefined it.  the second time fails
        // because I can't redefine a property.  I don't think there is a way
        // to find out if it's already defined though.

        let definitions = [
            {key: "width",       value: windowSize.width},
            {key: "availWidth",  value: windowSize.width},
            {key: "height",      value: windowSize.height},
            {key: "availHeight", value: windowSize.height}
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

    let screenDimensionScript = Functions.functionToScript(configureBrowserWindowSize, windowSize);

    await window.webContents.executeJavaScript(screenDimensionScript);

}

function getWindowSize(window) {

    let size = window.getSize();

    return {
        width: size[0],
        height: size[1]
    }

}

/**
 * Take the given HTML and inline the CSS, SVG, images, etc.
 */
async function inlineHTML(url, content) {

    log.info("Inlining HTML...");

    let options = {
        url,
        source: content,
        images: true,
        videos: true,
        preserveComments: true,
        collapseWhitespace: false,
        compressJS: false,
        skipAbsoluteUrls: false,
        compressCSS: false,
        inlinemin: false,
        nosvg: false
    };

    return new Promise((resolve, reject) => {

        let inliner = new Inliner(content, options, function (error, html) {
            if(error) {
                reject(error);
            } else {
                log.info("Inlining HTML...done");
                resolve(html);
            }
        });

        inliner.on('progress', function (event) {
            console.error("progress: ", event);
        });

    });

}

async function captureHTML(url, window) {

    // TODO: this function should be cleaned up a bit.. it has too many moving
    // parts now.

    Preconditions.assertNotNull(window);
    Preconditions.assertNotNull(window.webContents);

    log.info("Capturing the HTML...");

    // define the content capture script.
    log.info("Defining ContentCapture...");
    await window.webContents.executeJavaScript(ContentCapture.toString());

    log.info("Retrieving HTML...");

    let captured = await window.webContents.executeJavaScript("ContentCapture.captureHTML()");

    // record the browser that was used to render this page.
    captured.browser = browser;

    let stashDir = diskDatastore.stashDir;
    let filename = Filenames.sanitize(captured.title);

    // TODO convert the captured JSON to a phz file...

    let phzPath = `${stashDir}/${filename}.phz`;
    let capturedPHZWriter = new CapturedPHZWriter(phzPath);
    await capturedPHZWriter.convert(captured)

    captured = prettifyCaptured(captured);

    let jsonPath = `${stashDir}/${filename}.json`;

    log.info("Writing JSON data to: " + jsonPath);

    fs.writeFileSync(jsonPath, JSON.stringify(captured, null, "  "));
    fs.writeFileSync(`${stashDir}/${filename}.chtml`, captured.content);

    log.info("Capturing the HTML...done");

    if(args.quit) {
        app.quit();
    } else {
        log.info("Not quitting (yielding to --no-quit=true).")
    }

}

/**
 * Move the 'content' key to the last entry so that it's more readable when
 * working with the JSON directly.
 */
function prettifyCaptured(captured) {

    let content = captured.content;
    delete captured.content;

    captured.content = content;

    return captured

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

        this.pendingWebRequestsListener = new PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener();

        /**
         *
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

        let pagingLoader = new PagingLoader(pagingBrowser, async () => {

            setTimeout(() => {

                // capture within timeout just for debug purposes.
                captureHTML(this.url, this.window)
                    .catch(err => log.error(err));

            }, 1);


        } );

        this.pendingWebRequestsListener.addEventListener(pendingRequestEvent => {
            pagingLoader.onPendingRequestsUpdate(pendingRequestEvent);
        });

        await pagingLoader.onLoad();

    }

    async createWindow() {

        // Create the browser window.
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(browser);

        debug("Using browserWindowOptions: " + browserWindowOptions);

        let newWindow = new BrowserWindow(browserWindowOptions);

        this.debugWebRequestsListener.register(newWindow.webContents.session.webRequest);
        this.pendingWebRequestsListener.register(newWindow.webContents.session.webRequest);

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

            console.log("Registering new webRequest listeners");

            // We get one webContents per frame so we have to listen to their
            // events too..

            // FIXME: we can only have ONE event listener here which is frustrating...
            //this.debugWebRequestsListener.register(event.sender.webContents.session.webRequest);
            this.pendingWebRequestsListener.register(event.sender.webContents.session.webRequest);

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

        Logger.init(diskDatastore.logsDir);

        let url = Cmdline.getURLArg(process.argv);

        if(! url) {
            throw new Error("URL required");
        }

        let capture = new Capture(url);

        await capture.execute();

    })().catch(err => log.error(err));

});
