const assert = require('assert');
const {assertJSON} = require("../../../web/js/test/Assertions");
const {Functions} = require("../../../web/js/util/Functions");
const {Spectron} = require("../../../web/js/test/Spectron");

const TIMEOUT = 10000;

describe('DebugWebRequestsListener', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    it('shows an initial window', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        await Functions.waitFor(50000);

    });

});
