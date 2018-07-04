const path = require('path');
const {Spectron} = require("../../../web/js/test/Spectron");

describe('Open specific PHZ file from command line', function () {
    this.timeout(10000);

    let examplePHZ = path.join(__dirname, "../../../example.phz");

    Spectron.setup(path.join(__dirname, '../../..'), examplePHZ);

    it('PDF file loads', async function () {

        await this.app.client.waitForExist(`iframe[src="https://en.m.wikipedia.org/wiki/Prime_number"]`);

    });

});
