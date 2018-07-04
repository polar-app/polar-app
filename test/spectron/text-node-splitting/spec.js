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
            let rowIndex = TextNodeRows.computeRowIndex(p);

            return rowIndex.meta();

        });

        assertJSON(executed.value, {
            "0:0": 110,
            "100:119": 56,
            "119:138": 61,
            "138:157": 64,
            "157:176": 58,
            "176:195": 61,
            "195:214": 58,
            "214:233": 56,
            "233:252": 60,
            "252:271": 60,
            "271:290": 58,
            "290:309": 57,
            "309:328": 56,
            "328:347": 60,
            "347:366": 57,
            "366:385": 54,
            "385:404": 51,
            "404:423": 52,
            "423:442": 55,
            "442:461": 58,
            "461:480": 58,
            "480:499": 54,
            "499:518": 35,
            "81:100": 60
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
