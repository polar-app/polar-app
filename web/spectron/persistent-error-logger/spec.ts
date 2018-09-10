
import {assert} from 'chai';
import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {FilePaths} from '../../js/util/FilePaths';
import {Directories} from '../../js/datastore/Directories';
import {Files} from '../../js/util/Files';

process.env.POLAR_DATA_DIR = FilePaths.createTempName('.polar-persistent-error-logger');

describe('persistent-error-logger', async function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    let directories: Directories;

    beforeEach(async function() {

        directories = new Directories();
        await directories.init();

    });

    it('test writing errors', async function() {

        assert.ok(await Files.existsAsync(directories.logsDir));

        await SpectronSpec.create(this.app).waitFor(true);

        // now make sure the data is in our file now that the app says they were
        // written

        const data = await Files.readFileAsync(FilePaths.create(directories.logsDir, 'polar.log'));

        assert.ok(data.indexOf('This is from the main process:') !== -1);
        assert.ok(data.indexOf('Fake error in main process') !== -1);
        assert.ok(data.indexOf('This is from the renderer process:') !== -1);
        assert.ok(data.indexOf('Fake error in the renderer process') !== -1);

    });

});
