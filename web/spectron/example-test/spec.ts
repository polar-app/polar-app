import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';

const assert = require('assert');
const {Functions} = require("../../js/util/Functions");
const {Spectron} = require("../../js/test/Spectron");
import {assertJSON} from '../../js/test/Assertions';

const TIMEOUT = 10000;

describe('example-test', () => {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    it('shows an basic initial window', async () => {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

    });

});
