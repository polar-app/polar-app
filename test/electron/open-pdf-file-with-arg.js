const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

describe('Open PDF file from command line', function () {
    this.timeout(10000)

    beforeEach(function () {

        let examplePDF = path.join(__dirname, "../../example.pdf");

        this.app = new Application({

            // Your electron path can be any binary
            // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
            // But for the sake of the example we fetch it from our node_modules.
            path: electronPath,

            // Assuming you have the following directory structure

            // The following line tells spectron to look and use the main.js file
            args: [path.join(__dirname, '../..'), examplePDF]

        })
        return this.app.start()
    })

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    });

    it('PDF file loads', async function () {

        await this.app.client.waitUntilTextExists('.textLayer', 'Trace-based Just-in-Time', 10000)

    });

})
