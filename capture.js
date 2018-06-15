// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const options = { extraHeaders: 'pragma: no-cache\n' }


const BROWSER_WINDOW_OPTIONS = {
    minWidth: 400,
    minHeight: 300,
    width: 1280,
    height: 1024,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    icon: app_icon,
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

function createWindow() {

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

    // TODO: we need SANE handling of dev tools.  Having it forced on us isn't fun.
    // newWindow.webContents.on('devtools-opened', function(e) {
    //    e.preventDefault();
    //    this.closeDevTools();
    // });

    newWindow.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    newWindow.loadURL(DEFAULT_URL, options);

    newWindow.once('ready-to-show', () => {
        //newWindow.maximize();
        newWindow.show();
    });

    return newWindow;

}
