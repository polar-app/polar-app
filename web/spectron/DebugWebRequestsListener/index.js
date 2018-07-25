
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {DebugWebRequestsListener} = require("../../js/webrequests/DebugWebRequestsListener.js");
const {Logger} = require("../../js/logger/Logger.js");
const {WebRequestReactor} = require("../../js/webrequests/WebRequestReactor");

function createMainWindow() {

    let mainWindow = new BrowserWindow();

    let webRequestReactor = new WebRequestReactor(mainWindow.webContents.session.webRequest);
    webRequestReactor.start();

    let debugWebRequestsListener = new DebugWebRequestsListener();
    debugWebRequestsListener.register(webRequestReactor);

    mainWindow.loadURL('http://httpbin.org/get');
    return mainWindow;

}

app.on('ready', async function() {

    await Logger.init("/tmp/DebugWebRequestsListener");
    createMainWindow();

});

