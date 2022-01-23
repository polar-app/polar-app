import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Highlights} from "./Highlights";
import {Assertions} from "polar-test/src/test/Assertions";
import {assert} from 'chai';
import {HTMLStr} from "polar-shared/src/util/Strings";
import assertJSON = Assertions.assertJSON;
import HighlightViewportPositionsResult = Highlights.HighlightViewportPositionsResult;

describe('Highlights', () => {

    function doTest(html: HTMLStr): HighlightViewportPositionsResult {

        document.body.innerHTML = html;

        const elements = document.body.querySelectorAll('b');
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

        const [highlightViewportPositions] = doTest('<b>hello</b> <b>world</b>');

        assertJSON(highlightViewportPositions, [
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

        const [highlightViewportPositions] = doTest('<b>hello</b> <br/> <br/><br/><b>world</b>');

        assert.equal(highlightViewportPositions.length, 2);

        assertJSON(highlightViewportPositions, [
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

        const [highlightViewportPositions, nodeTextRegions, rawHighlightViewportPositions] = doTest('<b>This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. This is some super long text that does a word wrap. </b>');

        const [filtered, merged, grouped ] = Highlights.mergeHighlightViewportPositions(rawHighlightViewportPositions)

        // FIXME: on safari, the LAST entry is the height of the whole entry.  This is the bug because it's just wrong.
        // FIXME: I'm going to have to refactor and rethink this as I'm definitely doing something wrong here.
        // FIXME: it could be that I'm measuring the height wrong and adding +1 in my code or something which is causing the problem.

        // '[
        //   {
        //     "top": 8,
        //     "left": 8,
        //     "width": 1893,
        //     "height": 36,
        //     "nodeID": 0,
        //     "start": 278,
        //     "end": 279,
        //     "node": {}
        //   }
        // ]

        assertJSON(grouped['nodeID=0&top=8&height=36&nodeType=3'], {})


        assertJSON(Object.keys(grouped), [
            "nodeID=0&top=8&height=18&nodeType=3",
            "nodeID=0&top=26&height=18&nodeType=3"
        ]);

        // [
        //     "nodeID=0&top=8&height=18",
        //     "nodeID=0&top=8&height=36",
        //     "nodeID=0&top=26&height=18"
        // ]

        // assertJSON(grouped, {
        //
        // })

        // assert.equal(Object.keys(grouped).length, 2);


        // assert.equal(merged.length, 1);
        //
        // assert.equal(filtered.length, 1);
        // assert.equal(nodeTextRegions.length, 208);
        // assert.equal(rawHighlightViewportPositions.length, 208);
        // assert.equal(highlightViewportPositions.length, 1);

        function canonicalize(data: any) {
            return {
                ...data,
                width: Math.ceil(data.width)
            };
        }
        //
        // assertJSON(canonicalize(highlightViewportPositions[0]), {
        //         "top": 8,
        //         "left": 8,
        //         "height": 18,
        //         "width": 1410,
        //         "node": {},
        //         "nodeID": 0,
        //         "start": 0,
        //         "end": 208
        //     }
        // );

    });

});
