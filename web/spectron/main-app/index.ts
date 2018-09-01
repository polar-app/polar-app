import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Datastore} from '../../js/datastore/Datastore';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {Logging} from '../../js/logger/Logging';
import {MainApp} from '../../js/apps/main/MainApp';
import BrowserWindow = Electron.BrowserWindow;

async function createWindow(): Promise<BrowserWindow> {

    let datastore: Datastore = new MemoryDatastore();

    await datastore.init();

    await Logging.init();

    let mainApp = new MainApp(datastore);
    let {mainWindow} = await mainApp.start();

    return mainWindow;

}

SpectronMain2.create({windowFactory: createWindow}).run(async state => {


});
