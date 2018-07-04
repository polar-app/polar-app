const assert = require('assert');
const {assertJSON} = require("../../../web/js/test/Assertions");
const {Spectron} = require("../../../web/js/test/Spectron");

describe('Text Node Splitting', function () {

    this.timeout(10000);

    Spectron.setup(__dirname);

    it('split basic text', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let executed = await this.app.client.execute(() => {

            const {TextNodeRows} = require("../../../web/js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");
            return TextNodeRows.splitNode(p);

        });

        executed = await this.app.client.execute(() => {

            const {TextNodeRows} = require("../../../web/js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");
            TextNodeRows.computeRowIndex(p);

            return true;

        });


        // executed = await this.app.client.execute(() => {
        //
        //     const {TextNodeRows} = require("../../../web/js/highlights/text/selection/TextNodeRows");
        //
        //     let p = document.querySelector("p");
        //     TextNodeRows.computeRowIndex(p);
        //
        //     return true;
        //
        // });

        //assert.deepEqual(executed.value, 1406);

    });

});
