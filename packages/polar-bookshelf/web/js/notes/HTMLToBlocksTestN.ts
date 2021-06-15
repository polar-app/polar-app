import {assert} from "chai";
import {HTMLToBlocks, IBlockContentStructure} from "./HTMLToBlocks";
import { JSDOM } from "jsdom"

describe('HTMLToBlocks', () => {
    beforeEach(() => {
        const dom = new JSDOM();

        global.document = dom.window.document;
        global.Node = dom.window.Node;
    });
    describe('parse', () => {
        it('should parse basic unordered lists', async () => {
            const input = `<meta http-equiv="content-type" content="text/html; charset=utf-8">
            <ul><div>
                    <li>Fsadf</li>
                    </div><div>
                    <li>Item1</li>
                    </div><div>
                    <li>Item2</li>
                    </div><div>
                    <li>Item3</li>
                    </div><div>
                    <li>Item4</li>
                    </div></ul>
            `;

            const output: IBlockContentStructure[] = [
                {content: HTMLToBlocks.createMarkdownContent("Fsadf"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item1"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item2"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item3"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item4"), children: []},
            ];

            assert.deepEqual(await HTMLToBlocks.parse(input), output);
        });

        it('should parse nested lists', async () => {
            const input = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><meta charset="utf-8"><b id="docs-internal-guid-b23c597f-7fff-6ccf-5013-28c0685ab31e"><ol ltr" aria-level="1"><p dir="ltr" role="presentation"><span >item1</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span >item2</span></p></li><ol ><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span >hmm</span></p></li><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span >world</span></p></li><ol ><li dir="ltr" aria-level="3"><p dir="ltr" role="presentation"><span >potato</span></p></li></ol></ol><li dir="ltr"  aria-level="1"><p dir="ltr" role="presentation"><span >item3</span></p></li></ol></b>`;

            const output: IBlockContentStructure[] = [
                {content: HTMLToBlocks.createMarkdownContent("item1"), children: []},
                {
                    content: HTMLToBlocks.createMarkdownContent("item2"),
                    children: [
                        {content: HTMLToBlocks.createMarkdownContent("hmm"), children: []},
                        {
                            content: HTMLToBlocks.createMarkdownContent("world"),
                            children: [
                                {content: HTMLToBlocks.createMarkdownContent("potato"), children: []},
                            ]
                        },
                    ]
                },
                {content: HTMLToBlocks.createMarkdownContent("item3"), children: []},
            ];

            assert.deepEqual(await HTMLToBlocks.parse(input), output);
        });

        it('should join the content of nested inline tags and siblings', async () => {
            const input = `
                world?
                <span>Hello</span>
                <b>Whatever<span>potato</span>
                </b>`;
            const output: IBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent(" world? Hello Whateverpotato "),
                    children: []
                },
            ];

            assert.deepEqual(await HTMLToBlocks.parse(input), output);
        });
    });
});
