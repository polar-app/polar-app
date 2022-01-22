import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Highlights} from "./Highlights";
import {Assertions} from "polar-test/src/test/Assertions";
import {assert} from 'chai';
import {HTMLStr} from "polar-shared/src/util/Strings";
import assertJSON = Assertions.assertJSON;

describe('Highlights', () => {

    function doTest(html: HTMLStr) {

        document.body.innerHTML = html;

        const elements = document.body.querySelectorAll('b');

        // assert.equal(Math.floor(node0.getBoundingClientRect().width), 32);
        // assert.equal(Math.floor(node0.getBoundingClientRect().height), 18);
        //
        // assert.equal(Math.floor(node1.getBoundingClientRect().width), 40);
        // assert.equal(Math.floor(node1.getBoundingClientRect().height), 18);

        function createNodeTextRegionFromTextElement(node: HTMLElement) {

            const firstChild = node.firstChild as Text;

            return <NodeTextRegion> {
                nodeID: 0,
                start: 0,
                end: firstChild.textContent!.length,
                node: firstChild
            };

        }

        const nodeTextRegions = Array.from(elements).map(current => createNodeTextRegionFromTextElement(current));

        return Highlights.toHighlightViewportPositions(nodeTextRegions);

    }

    it('basic', () => {

        const result = doTest('<b>hello</b> <b>world</b>');

        assertJSON(result, [
            {
                "top": 8,
                "left": 8,
                "height": 18,
                "width": 76.890625,
                "node": {},
                "nodeID": 0,
                "start": 0,
                "end": 5
            }
        ]);

    });

    it('basic with breaks', () => {

        const result = doTest('<b>hello</b> <br/> <br/><br/><b>world</b>');

        assert.equal(result.length, 2);

        assertJSON(result, [
            {
                "top": 8,
                "left": 8,
                "height": 18,
                "width": 32.890625,
                "node": {},
                "nodeID": 0,
                "start": 0,
                "end": 5
            },
            {
                "top": 62,
                "left": 8,
                "height": 18,
                "width": 40,
                "node": {},
                "nodeID": 0,
                "start": 0,
                "end": 5
            }
        ]);

    });

    it('super long paragraph with text that wraps to the next line', () => {

        const result = doTest('<b>This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. </b>');

        assert.equal(result.length, 6);

        // assertJSON(result, [
        //     {
        //         "top": 8,
        //         "left": 8,
        //         "height": 18,
        //         "width": 32.890625,
        //         "node": {},
        //         "nodeID": 0,
        //         "start": 0,
        //         "end": 5
        //     },
        //     {
        //         "top": 62,
        //         "left": 8,
        //         "height": 18,
        //         "width": 40,
        //         "node": {},
        //         "nodeID": 0,
        //         "start": 0,
        //         "end": 5
        //     }
        // ]);

    });

});
