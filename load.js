const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', async function() {

    let width = 800;
    let height = 1000;

    let options = {
        minWidth: width,
        minHeight: height,
        width: width,
        height: height,
        show: true,

        // Enable the window to be resized larger than screen. Default is false.
        enableLargerThanScreen: true,

        webPreferences: {
            nodeIntegration: false,
            defaultEncoding: 'UTF-8',
            webaudio: false,
            offscreen: false,

            /**
             * This is needed for now because we have to access the iframe
             * content from the frame and that might not be possible otherwise.
             * There is not necessarily anything to steal here yet as we're
             * not using any type of cookie sharing but we might in the future
             * so need to be careful here.  As soon as we can get access
             * to the iframe documents from electron we should move to
             * a more secure solution.
             */
            webSecurity: false
        }

    };

    let mainWindow = new BrowserWindow(options);

    //mainWindow.loadURL('about:blank')

    let url = 'https://en.m.wikipedia.org/wiki/Multiple_inheritance';
    mainWindow.loadURL(url)

});

