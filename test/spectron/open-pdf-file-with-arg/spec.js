const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');
const {Spectron} = require("../../../web/js/test/Spectron");

describe('Open specific PDF file from command line', function () {
    this.timeout(10000);

    let examplePDF = path.join(__dirname, "../../../example.pdf");

    Spectron.setup(path.join(__dirname, '../../..'), examplePDF);

    it('PDF file loads', async function () {

        await this.app.client.waitUntilTextExists('.textLayer', 'Trace-based Just-in-Time', 10000)

    });

})
