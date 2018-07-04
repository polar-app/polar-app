const assert = require('assert');
const {assertJSON} = require("../../../web/js/test/Assertions");
const {Spectron} = require("../../../web/js/test/Spectron");

describe('DebugWebRequestsListener', function () {

    this.timeout(10000);

    Spectron.setup(__dirname);

    it('shows an initial window', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

    });

});
