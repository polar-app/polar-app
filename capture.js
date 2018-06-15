// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs');
const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const {ContentCapture} = require("./web/js/capture/ContentCapture");
const {Preconditions} = require("./web/js/Preconditions");

const options = { extraHeaders: 'pragma: no-cache\n' }


const BROWSER_WINDOW_OPTIONS = {
    minWidth: 450,
    minHeight: 450,
    width: 450,
    height: 450,
    maxWidth: 450,
    maxHeight: 450,
    //show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    webPreferences: {
        // TODO:
        // https://github.com/electron/electron/pull/794
        //
        // reconsider using nodeIntegration here as this might be a security
        // issue
        nodeIntegration: true,
        defaultEncoding: 'UTF-8'
    }
};

// https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsenabledeviceemulationparameters
const DEVICE_EMULATION = {
    screenPosition: "mobile",
    screenSize: {
        width: 450,
        height: 450
    },
    viewSize: {
        width: 450,
        height: 450
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

        console.log("Muting audio...");
        newWindow.webContents.setAudioMuted(true);

        console.log("Emulating device");
        newWindow.webContents.enableDeviceEmulation(DEVICE_EMULATION);

        let screenDimensionScript = `
            Object.defineProperty(window.screen, "width", { get: function() { console.log("Returning custom width"); return 450; }});
            Object.defineProperty(window.screen, "height", { get: function() { console.log("Returning custom height"); return 450; }});
            Object.defineProperty(window.screen, "availWidth", { get: function() { console.log("Returning custom availWidth"); return 450; }});
            Object.defineProperty(window.screen, "availHeight", { get: function() { console.log("Returning custom availHeight"); return 450; }});
        `;

        await newWindow.webContents.executeJavaScript(screenDimensionScript);

    });


    newWindow.webContents.on('did-finish-load', async function() {
        console.log("did-finish-load: ");
        await captureHTML(newWindow);
    });

    newWindow.loadURL(url, options);

    // we need to mute by default especially if the window is hidden.
    console.log("Muting audio...");
    newWindow.webContents.setAudioMuted(true);

    console.log("Emulating device");
    newWindow.webContents.enableDeviceEmulation(DEVICE_EMULATION);

    return newWindow;

}

async function captureHTML(window) {

    Preconditions.assertNotNull(window);
    Preconditions.assertNotNull(window.webContents);

    console.log("Capturing the HTML...");

    // define the content capture script.
    console.log("Defining script...");
    await window.webContents.executeJavaScript(ContentCapture.toString());

    console.log("Retrieving HTML...");
    let captured = await window.webContents.executeJavaScript("ContentCapture.captureHTML()");

    fs.writeFileSync("captured.json", JSON.stringify(captured, null, "  "));
    fs.writeFileSync("captured.chtml", captured.content);

    // write two files.. captured.json and captured.html
    //console.log(capturedHTML);

    console.log("Capturing the HTML...done");

    app.quit();

}

app.on('ready', function() {

    //let url = "http://thehill.com/homenews/administration/392430-trump-i-want-americans-to-listen-to-me-like-north-koreans-listen-to";
    //let url = "https://www.whatismyscreenresolution.com/";
    let url = "https://thinkprogress.org/trump-lied-in-statement-about-russian-meeting-224345b768e3/";

    createWindow(url);

});
