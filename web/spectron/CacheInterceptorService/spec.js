const assert = require('assert');
const {Spectron} = require("../../js/test/Spectron");
const {MockPHZWriter} = require("../../js/phz/MockPHZWriter");

describe("CacheInterceptorService", function () {

    this.timeout(10000);

    Spectron.setup(__dirname);

    let path = "/tmp/cache-interceptor-service.phz";

    before(async function () {

        await MockPHZWriter.write(path)

    });

    it('Load PHZ file via cache', function () {

        return this.app.client.getWindowCount().then(function (count) {

            // FIXME: make sure all the web pages in the app loaded.

            assert.equal(count, 1);
        })

    });

});
