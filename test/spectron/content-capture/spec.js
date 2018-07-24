const assert = require('assert');
const {assertJSON} = require("../../../web/js/test/Assertions");
const {Functions} = require("../../../web/js/util/Functions");
const {Spectron} = require("../../../web/js/test/Spectron");

const TIMEOUT = 10000;

describe('DebugWebRequestsListener', function () {

    this.timeout(TIMEOUT);

    console.log("FIXME: __dirname: " + __dirname)

    Spectron.setup(__dirname);

    it('shows an initial window', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

    });

});
