import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';

xdescribe('Repository App', function() {

    Spectron.setup(__dirname);
    xit('basic', async function() {
        await SpectronSpec.create(this.app).waitFor(true);
    });

});
