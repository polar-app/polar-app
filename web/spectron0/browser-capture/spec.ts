import {Spectron} from '../../js/test/Spectron';
import {SpectronSpec} from '../../js/test/SpectronSpec';
import {PolarDataDir} from '../../js/test/PolarDataDir';

// we can change the polar data dir with the following
// PolarDataDir.useFreshDirectory('.polar-persistent-error-logger');

describe('browser-capture', function() {

    console.log("Setting up spectron...");
    Spectron.setup(__dirname);

    before(async function() {
        console.log("Using fresh data dir...");
        await PolarDataDir.useFreshDirectory('.polar-browser-capture');
    });

    it('Test browser capturing and writing to a file.', async function() {

        console.log("Creating and running spectron test...");
        await SpectronSpec.create(this.app).waitFor(true);

    });

});
