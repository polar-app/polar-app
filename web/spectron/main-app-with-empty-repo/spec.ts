import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {PolarDataDir} from '../../js/test/PolarDataDir';


describe('main-app-with-empty-repo', async function() {

    await PolarDataDir.useFreshDirectory('.polar-main-app-with-empty-repo');

    Spectron.setup(__dirname);
    this.timeout(10000);

    it('create the repository view', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
