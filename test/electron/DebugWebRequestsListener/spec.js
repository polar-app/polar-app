const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');
const {Files} = require("../../../web/js/util/Files.js");
const {assertJSON} = require("../../../web/js/test/Assertions");

describe('Application launch', function () {
    this.timeout(10000)

    beforeEach(async function () {

        let logsDir = "/tmp/DebugWebRequestsListener";
        await Files.createDirAsync(logsDir);
        await Files.unlinkAsync(logsDir + "/polar.log");

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

        // make sure the window is shown so that our HTTP request completes
        return this.app.client.getWindowCount().then(async function (count) {
            assert.equal(count, 1)

            // now make sure the log data is properly stored.

            let logData = await Files.readFileAsync("/tmp/DebugWebRequestsListener/polar.log")
            logData = logData.toString("UTF-8");

            console.log(logData);

            // make sure we have all the events we need.  We could probably test
            // this more by asserting the entire JSON output but that might
            // be a bit heavy.
            assert.equal(logData.indexOf("onBeforeRequest") !== -1, true);
            assert.equal(logData.indexOf("onBeforeSendHeaders") !== -1, true);
            assert.equal(logData.indexOf("onSendHeaders") !== -1, true);
            assert.equal(logData.indexOf("onResponseStarted") !== -1, true);
            assert.equal(logData.indexOf("onCompleted") !== -1, true);

            return true;

        });

    });

});
