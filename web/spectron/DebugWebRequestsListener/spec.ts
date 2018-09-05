import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Files} from '../../js/util/Files';
import {FilePaths} from '../../js/util/FilePaths';

const assert = require('assert');
const {Spectron} = require("../../js/test/Spectron");

describe('DebugWebRequestsListener', function () {

    this.timeout(10000);

    before(async function () {
        let logsDir = FilePaths.tmpfile("DebugWebRequestsListener");
        await Files.createDirAsync(logsDir);
        await Files.removeAsync(FilePaths.join(logsDir, "polar.log"));
    });

    Spectron.setup(__dirname);

    xit('Make sure they are written to the log.', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

        return true;

    });

});
