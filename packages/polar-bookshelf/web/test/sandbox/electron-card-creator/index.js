
const path = require("path");
const {SpectronMain} = require("../../../js/test/SpectronRenderer");

async function start() {
    let mainWindow = await SpectronMain.setup();
    //mainWindow.loadURL("https://www.example.com");

    let url = 'file://' + path.resolve( __dirname + '/../../../apps/card-creator/index.html');
    console.log(url);
    mainWindow.loadURL(url);
}

start().catch(err => console.log(err));
