import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Highlights} from "./Highlights";
import {Assertions} from "polar-test/src/test/Assertions";
import {assert} from 'chai';
import {HTMLStr} from "polar-shared/src/util/Strings";
import assertJSON = Assertions.assertJSON;
import HighlightViewportPositionsResult = Highlights.HighlightViewportPositionsResult;

describe('Highlights', () => {

    /**
     * If any keys have values that are numbers then round them.
     */
    function roundedDict(dict: any) {

        const result = {...dict};

        for(const key of Object.keys(result)) {
            const value = result[key];

            if (typeof value === 'number') {
                result[key] = Math.floor(value);
            }
        }

        return result;

    }

    xdescribe('Browser Behavior', () => {

        it('element with just one char BCR', () => {

            function setup() {

                document.body.innerHTML = '<html><body><b>AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA AAAAA AAAA AAAA AAAA</b></body>';
                document.body.setAttribute('style', 'padding: 0; margin: 0; font-size: 12px; font-face: Arial;');

            }


            function copyRect(rect: DOMRect) {
                return {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
            }

            function getTestNodeRange() {

                const node = document.body.firstChild!.firstChild!;

                const range = document.createRange();

                range.setStart(node, 0);
                range.setEnd(node, 1);

                return range;

            }

            function getMainElement() {
                return document.body.firstChild! as HTMLElement;
            }

            setup();

            const mainElement = getMainElement();

            assertJSON(roundedDict(copyRect(mainElement.getBoundingClientRect())), {
                "height": 54,
                "left": 0,
                "top": 0,
                "width": 1847
            });

            const range = getTestNodeRange();

            assertJSON(roundedDict(copyRect(range.getBoundingClientRect())), {
                "height": 13,
                "left": 0,
                "top": 0,
                "width": 8
            });

        });

    });

    xdescribe('Core Functionality', () => {

        function doTest(html: HTMLStr): HighlightViewportPositionsResult {

            document.body.innerHTML = html;
            document.body.setAttribute('style', 'padding: 0; margin: 0');

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

            assert.equal(highlightViewportPositions.length, 1);

            assertJSON(roundedDict(highlightViewportPositions[0]), {
                "end": 5,
                "height": 18,
                "left": 0,
                "node": {},
                "nodeID": 0,
                "start": 0,
                "top": 0,
                "width": 76
            });

        });

        it('basic with breaks', () => {

            const [highlightViewportPositions] = doTest('<b>hello</b> <br/> <br/><br/><b>world</b>');

            assert.equal(highlightViewportPositions.length, 2);

            assertJSON(roundedDict(highlightViewportPositions[0]), {
                "end": 5,
                "height": 18,
                "left": 0,
                "node": {},
                "nodeID": 0,
                "start": 0,
                "top": 0,
                "width": 32
            });

            assertJSON(roundedDict(highlightViewportPositions[1]), {
                "end": 5,
                "height": 18,
                "left": 0,
                "node": {},
                "nodeID": 0,
                "start": 0,
                "top": 54,
                "width": 40
            });

        });


    });

});
