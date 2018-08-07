
const electron = require('electron');
const {ScreenshotService} = require("../../js/screenshots/ScreenshotService");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

console.log("hello world");

function createMainWindow() {
    let mainWindow = new BrowserWindow();
    mainWindow.loadFile('index.html')
    return mainWindow;
}

app.on('ready', async function() {

    let mainWindow = createMainWindow();

    new ScreenshotService();

    console.log("It worked!");

});

