import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {PolarDataDir} from '../../js/test/PolarDataDir';

PolarDataDir.useFreshDirectory('.polar-main-app-with-empty-repo');

describe('main-app-with-import', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    it('create the repository view', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});

