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
import {Logger} from '../../js/logger/Logger';
import process from "process";
import {FilePaths} from '../../js/util/FilePaths';
import {Files} from '../../js/util/Files';

const log = Logger.create();


async function createWindow(): Promise<BrowserWindow> {

    await setupNewDataDir();

    const datastore: Datastore = new MemoryDatastore();

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);
    const {mainWindow} = await mainApp.start();

    return mainWindow;

}

SpectronMain2.create({windowFactory: createWindow}).run(async state => {

    log.info("Waiting for repository to show...");

    await waitForExpect(() => {
        const windows = BrowserWindowRegistry.tagged({name: 'app', value: 'repository'});
        assert.ok(windows.length === 1);

    });

    // TODO: make sure the flashcard app is ready and running in the background

    // TODO: switch to the main repository app and double click on a document.
    // Might need to do this in the renderer context though as part of another
    // test.

    await state.testResultWriter.write(true);

});

async function setupNewDataDir() {

    const ENV_POLAR_DATA_DIR = 'POLAR_DATA_DIR';

    const dataDir = FilePaths.createTempName('.polar');
    log.info("Using new dataDir: " + dataDir);

    process.env[ENV_POLAR_DATA_DIR] = dataDir;

    await Files.removeDirectoryRecursively(dataDir);
    await Files.mkdirAsync(dataDir);

    const stashDir = FilePaths.create(dataDir, 'stash');

    log.info("Creating new dataDir: " + stashDir);

    await Files.mkdirAsync(stashDir);

    const filenames = ['example.pdf', 'example.phz'];

    for (const filename of filenames) {

        await Files.copyFileAsync(FilePaths.join(__dirname, 'files', filename),
                                  FilePaths.join(stashDir, filename));
    }

}
