import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Logger} from '../../js/logger/Logger';
import waitForExpect from 'wait-for-expect';
import {assert} from "chai";
import {FilePaths} from '../../js/util/FilePaths';

import process from 'process';
import {Files} from '../../js/util/Files';
import {Logging} from '../../js/logger/Logging';

const log = Logger.create();

process.env.POLAR_DATA_DIR = FilePaths.createTempName('.polar-persistent-error-logger');

SpectronMain2.create().run(async state => {

    await Logging.init();

    state.window.loadURL(`file://${__dirname}/app.html`);

    log.error("This is from the main process: ", new Error("Fake error in main process"));

    assert.ok(process.env.POLAR_DATA_DIR, "There is no POLAR_DATA_DIR defined");

    await waitForExpect(async () => {

        const path = FilePaths.join(process.env.POLAR_DATA_DIR!, "logs", "polar.log");
        assert.ok(await Files.existsAsync(path), "The polar.log file does not exist at: " + path);

    });

    await state.testResultWriter.write(true);

});
