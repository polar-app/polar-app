const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

describe('Application launch', function () {
    this.timeout(10000)

    beforeEach(function () {
        this.app = new Application({

            // Your electron path can be any binary
            // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
            // But for the sake of the example we fetch it from our node_modules.
            path: electronPath,

            // Assuming you have the following directory structure

            // The following line tells spectron to look and use the main.js file
            //args: [path.join(__dirname, '../../..')]
            args: [__dirname]

        });
        return this.app.start()
    });

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    });

    it('shows an initial window', function () {

        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1)
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        })

    });

});
