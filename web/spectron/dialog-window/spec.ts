import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';
import {assertJSON} from '../../js/test/Assertions';

const assert = require('assert');
const {Functions} = require("../../js/util/Functions");

describe('dialog-window', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    // FIXME: this test is broken because it doesn't use SpectronRenderer

    xit('create dialog window', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

    });

});
