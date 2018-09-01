import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';
import {assertJSON} from '../../js/test/Assertions';
import {SpectronSpec} from '../../js/test/SpectronSpec';

const assert = require('assert');

describe('example-test', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    it('shows an basic initial window', async function() {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
