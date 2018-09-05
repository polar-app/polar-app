import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Datastore} from '../../js/datastore/Datastore';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {Logging} from '../../js/logger/Logging';
import {MainApp} from '../../js/apps/main/MainApp';
import BrowserWindow = Electron.BrowserWindow;
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {wait} from 'dom-testing-library';
import {assert} from 'chai';
import waitForExpect from 'wait-for-expect';

async function createWindow(): Promise<BrowserWindow> {

    let datastore: Datastore = new MemoryDatastore();

    await datastore.init();

    await Logging.init();

    let mainApp = new MainApp(datastore);
    let {mainWindow} = await mainApp.start();

    return mainWindow;

}

SpectronMain2.create({windowFactory: createWindow}).run(async state => {

    await waitForExpect(() => {
        let windows = BrowserWindowRegistry.tagged({name: 'app', value: 'repository'});
        assert.ok(windows.length === 1);

    });

    // TODO: make sure the flashcard app is ready and running in the background

    // TODO: switch to the main repository app and double click on a document.
    // Might need to do this in the renderer context though as part of another
    // test.

    await state.testResultWriter.write(true);

});
