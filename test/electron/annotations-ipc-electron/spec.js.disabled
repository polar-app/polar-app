const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

describe('Test Electron IPC for annotation.', function () {
    this.timeout(10000)

    beforeEach(function () {

        this.app = new Application({

            // Your electron path can be any binary
            // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
            // But for the sake of the example we fetch it from our node_modules.
            path: electronPath,

            // Assuming you have the following directory structure

            args: [path.join(__dirname, "main.js")]

        });
        return this.app.start()
    })

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    });

    it('Test IPC with two windows', function () {

        //await this.app.client.waitUntilTextExists('.textLayer', 'Trace-based Just-in-Time', 10000)

    });

})
