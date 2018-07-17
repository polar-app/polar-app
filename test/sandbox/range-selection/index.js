
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

function createMainWindow() {
    let mainWindow = new BrowserWindow({
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('file://' + __dirname + '/range-selection.html')
    return mainWindow;

}

app.on('ready', async function() {
    let mainWindow = createMainWindow();
    console.log("FIXME1")

});

