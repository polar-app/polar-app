
import {app, BrowserWindow} from 'electron';
import {BrowserAppWindowFactory} from '../web/js/apps/electron_browser/BrowserAppWindowFactory';

const url = process.argv[2];

console.log("Loading url: " + url);

app.on('ready', async function() {
    //
    // let width = 800;
    // let height = 1000;
    //
    // let options = {
    //     minWidth: width,
    //     minHeight: height,
    //     width: width,
    //     height: height,
    //     show: true,
    //
    //     // Enable the window to be resized larger than screen. Default is false.
    //     enableLargerThanScreen: true,
    //
    //     webPreferences: {
    //         nodeIntegration: false,
    //         defaultEncoding: 'UTF-8',
    //         webaudio: false,
    //         offscreen: false,
    //
    //         /**
    //          * This is needed for now because we have to access the iframe
    //          * content from the frame and that might not be possible otherwise.
    //          * There is not necessarily anything to steal here yet as we're
    //          * not using any type of cookie sharing but we might in the future
    //          * so need to be careful here.  As soon as we can get access
    //          * to the iframe documents from electron we should move to
    //          * a more secure solution.
    //          */
    //         webSecurity: false
    //     }
    //
    // };
    //
    // let mainWindow = new BrowserWindow(options);

    const browserWindow = await BrowserAppWindowFactory.createWindow(url);
    browserWindow.webContents.setZoomFactor(1.0);

    // mainWindow.loadURL('about:blank')

    // mainWindow.loadURL(url)

});

