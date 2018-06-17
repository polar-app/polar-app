const electron = require('electron');
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;

const BROWSER_WINDOW_OPTIONS = {
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        defaultEncoding: 'UTF-8'
    }
};

class DialogWindow {

    static create(options) {

        // Create the browser window.
        let newWindow = new BrowserWindow(BROWSER_WINDOW_OPTIONS);

        // newWindow.on('close', function(e) {
        //     e.preventDefault();
        //     newWindow.webContents.clearHistory();
        //     newWindow.webContents.session.clearCache(function() {
        //         newWindow.destroy();
        //     });
        // });

        // newWindow.on('closed', function() {
        //
        //     if(BrowserWindow.getAllWindows().length === 0) {
        //         // determine if we need to quit:
        //         console.log("No windows left. Quitting app.");
        //         app.quit();
        //
        //     }
        //
        // });

        // newWindow.webContents.on('new-window', function(e, url) {
        //     e.preventDefault();
        //     shell.openExternal(url);
        // });

        // TODO: we need SANE handling of dev tools.  Having it forced on us isn't fun.
        // newWindow.webContents.on('devtools-opened', function(e) {
        //    e.preventDefault();
        //    this.closeDevTools();
        // });

        newWindow.webContents.on('will-navigate', function(e, url) {
            // required to force the URLs clicked to open in a new browser.  The
            // user probably / certainly wants to use their main browser.
            e.preventDefault();
            shell.openExternal(url);
        });

        if(options.url) {
            newWindow.loadURL(options.url, {});
        }

        newWindow.once('ready-to-show', () => {
            //newWindow.maximize();
            newWindow.show();
        });

        return newWindow;
    }

}




module.exports.DialogWindow = DialogWindow;
