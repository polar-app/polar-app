
const path = require("path");
const {SpectronRenderer} = require("../../../web/js/test/SpectronRenderer");

async function start() {
    let mainWindow = await SpectronRenderer.start();
    //mainWindow.loadURL("https://www.example.com");

    let url = 'file://' + path.resolve( __dirname + '/index.html');
    console.log(url);
    mainWindow.loadURL(url);
}

start().catch(err => console.log(err));
