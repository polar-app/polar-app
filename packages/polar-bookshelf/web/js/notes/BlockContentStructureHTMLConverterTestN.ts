import {assert} from "chai";
import {JSDOM} from "jsdom"
import {BlockContentStructureHTMLConverter} from "./BlockContentStructureHTMLConverter";
import {HTMLToBlocks} from "./HTMLToBlocks";
import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";

describe('BlockContentStructureConverter', () => {
    beforeEach(() => {
        const dom = new JSDOM();

        global.document = dom.window.document;
        global.Node = dom.window.Node;
        // @ts-ignore We only care about onload in this case
        global.Image = class Image extends dom.window.Image {
            constructor() {
                super();
                setTimeout(() => {
                    if (this.onload) {
                        this.onload();
                    }
                }, 10);
            }
        }
    });

    describe('toHTML', () => {
        it('should convert basic blocks structure to html', async () => {
            const blockStructure: IBlockContentStructure[] = [
                {id: '1', content: HTMLToBlocks.createMarkdownContent('hello'), children: []},
                {id: '2', content: HTMLToBlocks.createMarkdownContent('world'), children: []},
                {id: '3', content: await HTMLToBlocks.createImageContent('dataurl:fhasdklhgdalsh'), children: []}
            ];

            const output = BlockContentStructureHTMLConverter.toHTML(blockStructure);

            assert.equal(output, '<ul><li><div>hello</div></li><li><div>world</div></li><li><div><img src="dataurl:fhasdklhgdalsh" /></div></li></ul>');
        });

        it('should convert complex blocks structure to html', () => {
            const blockStructure: ReadonlyArray<IBlockContentStructure> = [
                {id: '0', content: HTMLToBlocks.createMarkdownContent("item1"), children: []},
                {
                    id: '1',
                    content: HTMLToBlocks.createMarkdownContent("[a link](https://www.google.com)"),
                    children: [
                        {id: '2', content: HTMLToBlocks.createMarkdownContent("hmm"), children: []},
                        {
                            id: '3', 
                            content: HTMLToBlocks.createMarkdownContent("![image](https://link.to.image)"),
                            children: [
                                {id: '4', content: HTMLToBlocks.createMarkdownContent("potato"), children: []},
                            ]
                        },
                    ]
                },
                {id: '5', content: HTMLToBlocks.createMarkdownContent("item3"), children: []},
                {id: '6', content: HTMLToBlocks.createMarkdownContent("Test bold italics [[Wiki]]"), children: []},
                {id: '7', content: HTMLToBlocks.createMarkdownContent("**Hello**"), children: []},
            ];

            const output = BlockContentStructureHTMLConverter.toHTML(blockStructure);

            assert.equal(output, '<ul><li><div>item1</div></li><li><div><a href="https://www.google.com">a link</a></div><ul><li><div>hmm</div></li><li><div><img src="https://link.to.image" alt="image"/></div><ul><li><div>potato</div></li></ul></li></ul></li><li><div>item3</div></li><li><div>Test bold italics <a contenteditable="false" class="note-link" href="#Wiki">Wiki</a></div></li><li><div><b>Hello</b></div></li></ul>');
        });
    });
});
