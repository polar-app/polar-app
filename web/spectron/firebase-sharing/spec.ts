import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('Firebase Sharing', function() {

    Spectron.setup(__dirname);
    this.timeout(120000);

    it('basic tests', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
