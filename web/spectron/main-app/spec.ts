import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('main-app', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    it('create the repository view', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
