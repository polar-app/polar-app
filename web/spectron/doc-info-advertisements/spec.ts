import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

describe('example-test', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    it('shows an basic initial window', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
