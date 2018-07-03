const {SpectronRenderer} = require("../../../web/js/test/SpectronRenderer");

async function start() {
    let mainWindow = await SpectronRenderer.start();
    //mainWindow.loadURL("https://www.example.com");
    mainWindow.loadURL('file://' + __dirname + '/index.html')
}

start().catch(err => console.log(err));
