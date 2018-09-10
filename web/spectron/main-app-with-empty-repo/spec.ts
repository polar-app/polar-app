import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

import process from 'process';
import {FilePaths} from '../../js/util/FilePaths';

describe('main-app', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    process.env.POLAR_DATA_DIR = FilePaths.createTempName(".polar-test2121");

    it('create the repository view', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
