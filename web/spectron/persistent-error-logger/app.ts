import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {FilePaths} from '../../js/util/FilePaths';
import {Logging} from '../../js/logger/Logging';

const log = Logger.create();

process.env.POLAR_DATA_DIR = FilePaths.createTempName('.polar-persistent-error-logger');

SpectronRenderer.run(async () => {

    await Logging.init();

    log.error("This is from the renderer process: ", new Error("Fake error in the renderer process"));

});
