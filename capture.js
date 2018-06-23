// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs');
const electron = require('electron');
const Inliner = require('inliner');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const {ContentCapture} = require("./web/js/capture/ContentCapture");
const {Preconditions} = require("./web/js/Preconditions");
const {Cmdline} = require("./web/js/electron/Cmdline");
const {Filenames} = require("./web/js/util/Filenames");
const {DiskDatastore} = require("./web/js/datastore/DiskDatastore");
const {Args} = require("./web/js/electron/capture/Args");

const WIDTH = 375;
const HEIGHT = 1100;

const BROWSERS = require("./web/js/util/Browsers");

// FIXME: remove meta http-equiv Location redirects.
// FIXME: don't allow meta charset and other ways to set the charset within the
//        HTML file as we are ALWAYS UTF-8

// FIXME: move this to BROWSERS
const BROWSER_WINDOW_OPTIONS = {
    minWidth: WIDTH,
    minHeight: HEIGHT,
    width: WIDTH,
    height: HEIGHT,
    //maxWidth: WIDTH,
    //maxHeight: HEIGHT,
    //show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    webPreferences: {
        nodeIntegration: false,
        defaultEncoding: 'UTF-8',
        webaudio: false
    }
};

function createWindow(url) {

    // Create the browser window.
    let newWindow = new BrowserWindow(BROWSER_WINDOW_OPTIONS);

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
            console.log("No windows left. Quitting app.");
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
        console.log("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);

        // FIXME: how do we handle iframes.

        // FIXME: figure out how to fail properly.
    });

    newWindow.webContents.on('did-start-loading', async function() {
        console.log("did-start-loading: ");

        configureBrowser(newWindow);

    });


    newWindow.webContents.on('did-finish-load', async function() {
        console.log("did-finish-load: ");

        setTimeout(async function() {
            await captureHTML(url, newWindow);
        }, 1);


    });

    configureBrowser(newWindow);

    const windowOptions = {
        extraHeaders: `pragma: no-cache\nreferer: ${url}\n`,
        userAgent: browser.userAgent
    };

    newWindow.loadURL(url, windowOptions);

    return newWindow;

}

async function configureBrowser(window) {

    // TODO maybe inject this via a preload script so we know that it's always
    // running

    console.log("Emulating browser: " + browser);

    // we need to mute by default especially if the window is hidden.
    console.log("Muting audio...");
    window.webContents.setAudioMuted(true);

    console.log("Emulating device...");
    window.webContents.enableDeviceEmulation(browser.deviceEmulation);

    // FIXME: see if I have already redefined it.  the second time fails because
    // I can't redefine a property.
    let screenDimensionScript = `
            Object.defineProperty(window.screen, "width", { get: function() { return 450; }});
            Object.defineProperty(window.screen, "height", { get: function() { return 450; }});
            Object.defineProperty(window.screen, "availWidth", { get: function() { return 450; }});
            Object.defineProperty(window.screen, "availHeight", { get: function() { return 450; }});
        `;

    await window.webContents.executeJavaScript(screenDimensionScript);

}

/**
 * Take the given HTML and inline the CSS, SVG, images, etc.
 */
async function inlineHTML(url, content) {

    console.log("Inlining HTML...");

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
                console.log("Inlining HTML...done");
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

    console.log("Capturing the HTML...");

    // define the content capture script.
    console.log("Defining script...");
    await window.webContents.executeJavaScript(ContentCapture.toString());

    console.log("Retrieving HTML...");

    let captured = await window.webContents.executeJavaScript("ContentCapture.captureHTML()");

    // if( ! args.noInline) {
    //     let inlined = await inlineHTML(captured.url, captured.content);
    //     captured.content = inlined;
    // }

    let filename = Filenames.sanitize(captured.title);

    let stashDir = diskDatastore.stashDir;

    fs.writeFileSync(`${stashDir}/${filename}.json`, JSON.stringify(captured, null, "  "));
    fs.writeFileSync(`${stashDir}/${filename}.chtml`, captured.content);

    console.log("Capturing the HTML...done");

    if(args.noQuit) {
        console.log("Not quitting (yielding to --no-quit=true).")
    } else {
        app.quit();
    }

}

function expand() {

    var element = document.body;

    console.log(element.offsetWidth);

}

let diskDatastore = new DiskDatastore();

let browser = BROWSERS.MOBILE_GALAXY_S8_WITH_CHROME_61;

let args = Args.parse(process.argv);

app.on('ready', async function() {

    await diskDatastore.init();

    //let url = "http://thehill.com/homenews/administration/392430-trump-i-want-americans-to-listen-to-me-like-north-koreans-listen-to";
    //let url = "https://www.whatismyscreenresolution.com/";
    //let url = "https://thinkprogress.org/trump-lied-in-statement-about-russian-meeting-224345b768e3/";

    let url = Cmdline.getURLArg(process.argv);

    if(! url) {
        throw new Error("URL required");
    }

    createWindow(url);

});
