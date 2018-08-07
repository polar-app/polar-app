const assert = require('assert');
const {assertJSON} = require("../../js/test/Assertions");
const {Functions} = require("../../js/util/Functions");
const {Spectron} = require("../../js/test/Spectron");

const TIMEOUT = 10000;

describe('messenger', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    it('shows an initial window', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

    });

});
