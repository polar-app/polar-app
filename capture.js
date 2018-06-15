// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const {ContentCapture} = require("./web/js/capture/ContentCapture");
const {Preconditions} = require("./web/js/Preconditions");

const options = { extraHeaders: 'pragma: no-cache\n' }


const BROWSER_WINDOW_OPTIONS = {
    minWidth: 400,
    minHeight: 300,
    width: 1280,
    height: 1024,
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

    newWindow.loadURL(url, options);

    newWindow.once('ready-to-show', () => {
        //newWindow.maximize();
        //newWindow.show();

        // we need to mute by default especially if the window is hidden.
        newWindow.webContents.setAudioMuted(true);

    });

    newWindow.webContents.on('did-fail-load', function(event, errorCode, errorDescription, validateURL, isMainFrame) {
        console.log("did-fail-load: " , {event, errorCode, errorDescription, validateURL, isMainFrame}, event);

        // FIXME: how do we handle iframes.

        // FIXME: figure out how to fail properly.
    });

    newWindow.webContents.on('did-finish-load', async function() {
        console.log("did-finish-load: ");
        await captureHTML(newWindow);
    });

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
    let capturedHTML = await window.webContents.executeJavaScript("ContentCapture.captureHTML()");

    console.log(capturedHTML);

    console.log("Capturing the HTML...done");
}

app.on('ready', function() {

    createWindow("http://thehill.com/homenews/administration/392430-trump-i-want-americans-to-listen-to-me-like-north-koreans-listen-to");

});
