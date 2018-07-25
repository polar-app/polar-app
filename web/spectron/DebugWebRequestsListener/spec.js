const assert = require('assert');
const {assertJSON} = require("../../js/test/Assertions");
const {Spectron} = require("../../js/test/Spectron");
const electronPath = require('electron');
const path = require('path');
const {Files} = require("../../js/util/Files.js");

describe('DebugWebRequestsListener', function () {

    this.timeout(10000);

    before(async function () {
        let logsDir = "/tmp/DebugWebRequestsListener";
        await Files.createDirAsync(logsDir);
        await Files.removeAsync(logsDir + "/polar.log");
    });

    Spectron.setup(__dirname);

    it('Make sure they are written to the log.', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // now make sure the log data is properly stored.

        let logData = await Files.readFileAsync("/tmp/DebugWebRequestsListener/polar.log")
        logData = logData.toString("UTF-8");

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
