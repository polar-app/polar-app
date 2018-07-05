const assert = require('assert');
const {assertJSON} = require("../../../web/js/test/Assertions");
const {Functions} = require("../../../web/js/util/Functions");
const {Spectron} = require("../../../web/js/test/Spectron");

describe('Text Node Splitting', function () {

    let timeout = 120000

    this.timeout(timeout);

    Spectron.setup(__dirname);

    it('splitNode', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let splitNodes = await this.app.client.execute(() => {

            const {TextNodeRows} = require("../../../web/js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            return TextNodeRows.splitNode(p);

        });

        assert.equal(splitNodes.value, 1428);

    });

    it('computeTextRegions', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let textRegions = await this.app.client.execute(() => {

            const {TextNodeRows} = require("../../../web/js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            TextNodeRows.splitNode(p);

            let textRegions = TextNodeRows.computeTextRegions(p);

            return textRegions.map(current => current.toJSON());

        });

        let expected = [
            {
                "nrNodes": 284,
                "text": "\n    1.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n    2.Sed pretium, dolor sed euismod tempor, diam urna\n    3.scelerisque tortor, vel semper ligula urna vel enim. Aenean\n    4.nec facilisis libero. Sed efficitur ac ligula in varius.\n    5.Pellentesque iaculis, enim ac "
            },
            {
                "nrNodes": 12,
                "text": "6. dignissim"
            },
            {
                "nrNodes": 90,
                "text": " aliquet, turpis\n    7.purus mattis felis, eget consequat eros velit et erat. 8.Curabitur "
            },
            {
                "nrNodes": 10,
                "text": "9. feugiat"
            },
            {
                "nrNodes": 184,
                "text": " 10.suscipit leo, vel\n\n\n    ultrices tortor sodales ut. Maecenas a magna eget nunc commodo rutrum ac et\n    augue. Quisque augue sem, ultricies ac ornare non, porta a eros. Morbi\n\n    "
            },
            {
                "nrNodes": 5,
                "text": "hello"
            },
            {
                "nrNodes": 850,
                "text": "\n\n    posuere, tellus nec cursus rhoncus, nibh leo ultricies urna, eget mollis mi\n    nisl nec purus. Mauris malesuada justo vitae finibus elementum. Donec\n    vestibulum erat ac sem consectetur eleifend. Nullam at nibh sed neque\n    accumsan tincidunt nec a enim. Aliquam pharetra orci tortor, eget gravida\n    felis dictum ac. Maecenas convallis nunc ultrices massa bibendum, et\n    dignissim elit tempus. Ut in luctus dolor, et maximus nisi. Etiam non\n    euismod sem.\n\n    Vestibulum pulvinar bibendum turpis at sodales. Vestibulum consectetur nulla\n    elementum eros rhoncus, non interdum diam tristique. Praesent interdum quam\n    in lacus finibus semper. Phasellus id feugiat tortor. Integer sed molestie\n    urna, a sodales libero. Morbi egestas egestas tortor sed sagittis. Aenean et\n    tellus non quam pellentesque ultrices vel non odio.\n"
            }
        ];

        assertJSON(textRegions.value, expected);

    });

    it('computeTextBlocks', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let textBlocks = await this.app.client.execute(() => {

            const {TextNodeRows} = require("../../../web/js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            TextNodeRows.splitNode(p);

            let textRegions = TextNodeRows.computeTextRegions(p);
            let textBlocks = TextNodeRows.computeTextBlocks(textRegions);

            return textBlocks.map(current => current.toJSON());

        });

        let expected = [
            {
                "nrNodes": 68,
                "text": "\n    1.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n    "
            },
            {
                "nrNodes": 55,
                "text": "2.Sed pretium, dolor sed euismod tempor, diam urna\n    "
            },
            {
                "nrNodes": 66,
                "text": "3.scelerisque tortor, vel semper ligula urna vel enim. Aenean\n    "
            },
            {
                "nrNodes": 63,
                "text": "4.nec facilisis libero. Sed efficitur ac ligula in varius.\n    "
            },
            {
                "nrNodes": 32,
                "text": "5.Pellentesque iaculis, enim ac "
            },
            {
                "nrNodes": 12,
                "text": "6. dignissim"
            },
            {
                "nrNodes": 21,
                "text": " aliquet, turpis\n    "
            },
            {
                "nrNodes": 57,
                "text": "7.purus mattis felis, eget consequat eros velit et erat. "
            },
            {
                "nrNodes": 12,
                "text": "8.Curabitur "
            },
            {
                "nrNodes": 10,
                "text": "9. feugiat"
            },
            {
                "nrNodes": 44,
                "text": " 10.suscipit leo, vel\n\n\n    ultrices tortor "
            },
            {
                "nrNodes": 54,
                "text": "sodales ut. Maecenas a magna eget nunc commodo rutrum "
            },
            {
                "nrNodes": 61,
                "text": "ac et\n    augue. Quisque augue sem, ultricies ac ornare non, "
            },
            {
                "nrNodes": 25,
                "text": "porta a eros. Morbi\n\n    "
            },
            {
                "nrNodes": 5,
                "text": "hello"
            },
            {
                "nrNodes": 33,
                "text": "\n\n    posuere, tellus nec cursus "
            },
            {
                "nrNodes": 62,
                "text": "rhoncus, nibh leo ultricies urna, eget mollis mi\n    nisl nec "
            },
            {
                "nrNodes": 55,
                "text": "purus. Mauris malesuada justo vitae finibus elementum. "
            },
            {
                "nrNodes": 62,
                "text": "Donec\n    vestibulum erat ac sem consectetur eleifend. Nullam "
            },
            {
                "nrNodes": 61,
                "text": "at nibh sed neque\n    accumsan tincidunt nec a enim. Aliquam "
            },
            {
                "nrNodes": 65,
                "text": "pharetra orci tortor, eget gravida\n    felis dictum ac. Maecenas "
            },
            {
                "nrNodes": 62,
                "text": "convallis nunc ultrices massa bibendum, et\n    dignissim elit "
            },
            {
                "nrNodes": 59,
                "text": "tempus. Ut in luctus dolor, et maximus nisi. Etiam non\n    "
            },
            {
                "nrNodes": 57,
                "text": "euismod sem.\n\n    Vestibulum pulvinar bibendum turpis at "
            },
            {
                "nrNodes": 57,
                "text": "sodales. Vestibulum consectetur nulla\n    elementum eros "
            },
            {
                "nrNodes": 56,
                "text": "rhoncus, non interdum diam tristique. Praesent interdum "
            },
            {
                "nrNodes": 63,
                "text": "quam\n    in lacus finibus semper. Phasellus id feugiat tortor. "
            },
            {
                "nrNodes": 63,
                "text": "Integer sed molestie\n    urna, a sodales libero. Morbi egestas "
            },
            {
                "nrNodes": 59,
                "text": "egestas tortor sed sagittis. Aenean et\n    tellus non quam "
            },
            {
                "nrNodes": 36,
                "text": "pellentesque ultrices vel non odio.\n"
            }
        ];

        assertJSON(textBlocks.value, expected);

    });

});
