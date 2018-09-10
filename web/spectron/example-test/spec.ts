import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('TODO change this describe', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    // we can change the polar data dir with the following
    // process.env.POLAR_DATA_DIR = FilePaths.createTempName('.polar-test2121');

    it('TODO change this test description', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
