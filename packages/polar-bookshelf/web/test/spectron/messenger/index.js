const {SpectronMain} = require("../../../js/test/SpectronMain");
const {Messenger} = require("../../../js/electron/messenger/Messenger");

async function start() {

    let mainWindow = await SpectronMain.setup();
    //mainWindow.loadURL("https://www.example.com");

    mainWindow.loadURL('file://' + __dirname + '/index.html')

    // wait until the mainWindow is loaded...

    mainWindow.webContents.on('did-finish-load', async () => {

        console.log("Finished");

    });

}

start().catch(err => console.log(err));
