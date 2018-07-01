const {Application} = require('spectron');
const assert = require('assert');
const path = require('path');
const {Spectron} = require("./Spectron");

describe('Application launch', function () {

    this.timeout(10000)

    Spectron.setup();

    it('shows an initial window', function () {

        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1)
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        })

    });

});
