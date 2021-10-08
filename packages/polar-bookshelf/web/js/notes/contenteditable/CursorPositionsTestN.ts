import {ConstructorOptions, JSDOM} from "jsdom";
import {assert} from "chai";
import {CursorPositions} from "./CursorPositions";
import {assertJSON} from "../../test/Assertions";

describe('CursorPositions', function() {

    it("basic ", function() {

        const element = JSDOMParser.parse(`<p>hello <b>world</b> this is <i>italic</i> text`);
        const cursorPositions = CursorPositions.computeCursorLookupArray(element);
        const testData = CursorPositions.toCursorLookupTestArray(cursorPositions);

        assertJSON(testData, [
            {
                "nodeText": "hello ",
                "offset": 0
            },
            {
                "nodeText": "hello ",
                "offset": 1
            },
            {
                "nodeText": "hello ",
                "offset": 2
            },
            {
                "nodeText": "hello ",
                "offset": 3
            },
            {
                "nodeText": "hello ",
                "offset": 4
            },
            {
                "nodeText": "hello ",
                "offset": 5
            },
            {
                "nodeText": "world",
                "offset": 0
            },
            {
                "nodeText": "world",
                "offset": 1
            },
            {
                "nodeText": "world",
                "offset": 2
            },
            {
                "nodeText": "world",
                "offset": 3
            },
            {
                "nodeText": "world",
                "offset": 4
            },
            {
                "nodeText": " this is ",
                "offset": 0
            },
            {
                "nodeText": " this is ",
                "offset": 1
            },
            {
                "nodeText": " this is ",
                "offset": 2
            },
            {
                "nodeText": " this is ",
                "offset": 3
            },
            {
                "nodeText": " this is ",
                "offset": 4
            },
            {
                "nodeText": " this is ",
                "offset": 5
            },
            {
                "nodeText": " this is ",
                "offset": 6
            },
            {
                "nodeText": " this is ",
                "offset": 7
            },
            {
                "nodeText": " this is ",
                "offset": 8
            },
            {
                "nodeText": "italic",
                "offset": 0
            },
            {
                "nodeText": "italic",
                "offset": 1
            },
            {
                "nodeText": "italic",
                "offset": 2
            },
            {
                "nodeText": "italic",
                "offset": 3
            },
            {
                "nodeText": "italic",
                "offset": 4
            },
            {
                "nodeText": "italic",
                "offset": 5
            },
            {
                "nodeText": " text",
                "offset": 0
            },
            {
                "nodeText": " text",
                "offset": 1
            },
            {
                "nodeText": " text",
                "offset": 2
            },
            {
                "nodeText": " text",
                "offset": 3
            },
            {
                "nodeText": " text",
                "offset": 4
            }
        ]);

    });

});

export namespace JSDOMParser {
    declare var global: any;

    export function parse(html: string) {

        const url = 'https://www.example.com';
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(`<html><body>${html}</body></html>`, opts);

        global.window = dom.window;
        global.NodeFilter = dom.window.NodeFilter;
        global.document = dom.window.document;

        return dom.window.document.body as HTMLElement;

    }

}
