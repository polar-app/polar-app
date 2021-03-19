import {SpectronMain} from "../../js/test/SpectronMain";

async function start() {
    const mainWindow = await SpectronMain.setup();
    mainWindow.loadURL('file://' + __dirname + '/index.html')
        .catch(err => console.error(err));
}

start().catch(err => console.log(err));
