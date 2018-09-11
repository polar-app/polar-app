import {assert} from 'chai';
import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';

xdescribe('webview-discovery', function() {

    Spectron.setup(__dirname);
    this.timeout(10000);

    xit('Verify that we can discovery webviews', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        const testResultReader = new WebDriverTestResultReader(this.app);

        assert.equal(await testResultReader.read(), true);

    });

});

