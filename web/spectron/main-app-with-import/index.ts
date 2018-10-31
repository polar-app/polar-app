import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Datastore} from '../../js/datastore/Datastore';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {Logging} from '../../js/logger/Logging';
import {MainApp} from '../../js/apps/main/MainApp';
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {assert} from 'chai';
import waitForExpect from 'wait-for-expect';
import {Logger} from '../../js/logger/Logger';
import {MainAppController} from '../../js/apps/main/MainAppController';
import BrowserWindow = Electron.BrowserWindow;
import {FileImportClient} from '../../js/apps/repository/FileImportClient';
import {Files} from '../../js/util/Files';
import {FilePaths} from '../../js/util/FilePaths';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {Promises} from '../../js/util/Promises';
import {wait} from 'dom-testing-library';
import {AppInstance} from '../../js/electron/framework/AppInstance';
import {AppInstances} from '../../js/electron/framework/AppInstances';

const log = Logger.create();

PolarDataDir.useFreshDirectory('.polar-persistent-error-logger');

async function createWindow(): Promise<BrowserWindow> {

    const datastore: Datastore = new DiskDatastore();

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);

    const mainAppState = await mainApp.start();

    // FIXME: this works but there is a race for startup...

    return mainAppState.mainWindow;

}

SpectronMain2.create({windowFactory: createWindow}).run(async state => {

    log.info("Waiting for repository to show...");

    log.info("Waiting for repository app...");

    await waitForExpect(() => {
        const windows = BrowserWindowRegistry.tagged({name: 'app', value: 'repository'});
        assert.ok(windows.length === 1);
    });

    log.info("Waiting for repository app...done");


    // FIXME: this isn't long enough to wait for the first window... need a way
    // for the renderer to say it's done.. a stage...


    const rawPath = FilePaths.join(__dirname, "..", "..", "..", "docs", "example.pdf");
    const importFilePath = await Files.realpathAsync(rawPath);
    assert.ok(await Files.existsAsync(importFilePath));

    const files = [
        importFilePath
    ];

    await AppInstances.waitForStarted('RepositoryApp');

    log.info("Sending file import client request...");
    FileImportClient.send({files});

    await state.testResultWriter.write(true);

});

