import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

import process from 'process';

describe('main-app', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    process.env.POLAR_DATA_DIR = '/tmp/.polar-test2121';

    it('create the repository view', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
