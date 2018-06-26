
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

console.log("hello world");

function createMainWindow() {
    return new BrowserWindow();
}

app.on('ready', async function() {

    let mainWindow = createMainWindow();

    console.log("It worked!");

});

