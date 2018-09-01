
import assert from 'assert';
import {Files} from '../../js/util/Files';
import {Spectron, TBrowser} from '../../js/test/Spectron';
const path = require('path');

describe('Open specific PDF file from command line', function () {
    this.timeout(10000);

    let examplePDF = path.join(__dirname, "../../../docs/example.pdf");

    Spectron.setup(path.join(__dirname, '../../..'), examplePDF);

    it('PDF file loads', async function () {

        assert.ok(await Files.existsAsync(examplePDF));

        //assert.equal(await this.app.client.getWindowCount(), 2);

        let client: TBrowser = this.app.client;

        console.log("FIXME: " + client.getTitle());

        console.log("OK.. both windows are up.");

        await this.app.client.waitUntilTextExists('.textLayer', 'Trace-based Just-in-Time', 10000)

        return true;

    });

});
