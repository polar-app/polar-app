import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';

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

    xit('Make sure they are written to the log.', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

        return true;

    });

});
