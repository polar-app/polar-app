const assert = require('assert');
const {Spectron} = require("../../../web/js/test/Spectron");

describe('Application launch', function () {

    this.timeout(10000)

    Spectron.setup(__dirname);

    it('shows an initial window', function () {

        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1)
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        })

    });

});
