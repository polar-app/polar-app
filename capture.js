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
            log.info(`Defining ${definition.key} as: ${definition.value}`);
            Object.defineProperty(window.screen, definition.key, { get: function() { return definition.value }});
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

    Preconditions.assertNotNull(window);
    Preconditions.assertNotNull(window.webContents);

    log.info("Capturing the HTML...");

    // define the content capture script.
    log.info("Defining ContentCapture...");
    await window.webContents.executeJavaScript(ContentCapture.toString());

    log.info("Retrieving HTML...");

    let captured = await window.webContents.executeJavaScript("ContentCapture.captureHTML()");

    // TODO: the inline system just doesn't work for now.
    // if( ! args.noInline) {
    //     let inlined = await inlineHTML(captured.url, captured.content);
    //     captured.content = inlined;
    // }

    // record the browser that was used to render this page.
    captured.browser = browser;
    captured.type = "chtml";
    captured.version = "1.0.0";

    captured = prettifyCaptured(captured);

    let filename = Filenames.sanitize(captured.title);

    let stashDir = diskDatastore.stashDir;

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
        this.pendingWebRequestsListener = null;
        this.window = null;
    }

    async execute() {

        this.pendingWebRequestsListener = new PendingWebRequestsListener();

        this.window = await this.createWindow(this.url);

        this.pendingWebRequestsListener.register(this.window.webContents.session.webRequest);

        const loadURLOptions = {

            // TODO: I don't think we should use no-cache or at least make it
            // a command line option. Probably best to not use it by default
            // but then make it an option later.

            extraHeaders: `pragma: no-cache\nreferer: ${this.url}\n`,
            userAgent: browser.userAgent

        };

        this.window.loadURL(this.url, loadURLOptions);

    }

    async createWindow(url) {

        // Create the browser window.
        let browserWindowOptions = BrowserWindows.toBrowserWindowOptions(browser);

        debug("Using browserWindowOptions: " + browserWindowOptions);

        let newWindow = new BrowserWindow(browserWindowOptions);

        let debugWebRequestsListener = new DebugWebRequestsListener();

        debugWebRequestsListener.register(newWindow.webContents.session.webRequest);

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

        newWindow.webContents.on('did-start-loading', async function() {
            log.info("did-start-loading: ");
            await configureBrowser(newWindow);
        });


        newWindow.webContents.on('did-finish-load', async function() {
            log.info("did-finish-load: ");

            // TODO: I don't remember why this needs setTimeout but we should
            // try without it and see if it introduces any problems. If it does
            // cause a problem we need to document why setTimeout is used.
            setTimeout(async function() {
                await captureHTML(url, newWindow);
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
