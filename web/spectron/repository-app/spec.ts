import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('Repository App', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    it('basic', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
