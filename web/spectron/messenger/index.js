const {SpectronRenderer} = require("../../js/test/SpectronRenderer");
const {Messenger} = require("../../js/electron/messenger/Messenger");

async function start() {

    let mainWindow = await SpectronRenderer.start();
    //mainWindow.loadURL("https://www.example.com");

    mainWindow.loadURL('file://' + __dirname + '/index.html')

    // wait until the mainWindow is loaded...

    mainWindow.webContents.on('did-finish-load', async () => {

        console.log("Finished");

    });

}

start().catch(err => console.log(err));
