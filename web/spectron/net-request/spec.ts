import {SpectronSpec} from '../../js/test/SpectronSpec';
import {Spectron} from '../../js/test/Spectron';
import {MockPHZWriter} from '../../js/phz/MockPHZWriter';
import {FilePaths} from '../../js/util/FilePaths';


describe("net-request", function () {

    this.timeout(10000);

    Spectron.setup(__dirname);

    it('Test basic request', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
