
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {DebugWebRequestsListener} = require("../../../web/js/webrequests/DebugWebRequestsListener.js");
const {Logger} = require("../../../web/js/logger/Logger.js");
const {Files} = require("../../../web/js/util/Files.js");
require("../../../web/js/test/TestingTime").freeze();

function createMainWindow() {
    let mainWindow = new BrowserWindow();

    let debugWebRequestsListener = new DebugWebRequestsListener();

    debugWebRequestsListener.register(mainWindow.webContents.session.webRequest);
    mainWindow.loadURL('http://httpbin.org/get')
    return mainWindow;

}

app.on('ready', async function() {

    await Logger.init("/tmp/DebugWebRequestsListener");

    console.log("hello world");

    let mainWindow = createMainWindow();

    console.log("It worked!");

});

