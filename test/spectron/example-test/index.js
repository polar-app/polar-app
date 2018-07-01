
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

console.log("Electron app started. Waiting for it to be ready.");

function createMainWindow() {
    let mainWindow = new BrowserWindow();
    mainWindow.loadFile('index.html')
    return mainWindow;
}

app.on('ready', async function() {

    console.log("The main app is now ready.  going to create a window.");

    let mainWindow = createMainWindow();

});

