const electron = require("electron");
const {SpectronRenderer} = require("../../../web/js/test/SpectronRenderer");

async function start() {
    let mainWindow = await SpectronRenderer.start();
    mainWindow.loadURL('file://' + __dirname + '/app.html');

    // once the mainWindow is ready, tell it to capture the content.

    mainWindow.webContents.send()

}

start().catch(err => console.log(err));
