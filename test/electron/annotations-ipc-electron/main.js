
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

console.log("hello world");

function createMainWindow() {
    let newWindow = new BrowserWindow();

}

app.on('ready', async function() {
    mainWindow = createMainWindow();

});

