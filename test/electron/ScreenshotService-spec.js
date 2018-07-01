const assert = require('assert')

const electron = require('electron');
const {ScreenshotService} = require("../../web/js/screenshots/ScreenshotService");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


function createMainWindow() {
    let mainWindow = new BrowserWindow();
    mainWindow.loadFile('index.html')
    return mainWindow;
}

describe('ScreenshotService', () => {

    it('Test create', function (done) {

        console.log("Waiting for app ready...");

        // app.on('ready', async function() {

            let mainWindow = createMainWindow();

            new ScreenshotService();

            console.log("It worked!");
            done();
        //
        // });

    });

});


