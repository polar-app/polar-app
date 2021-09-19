import {assert} from "chai";
import {JSDOM} from "jsdom"
import {BlockContentStructureConverter} from "./BlockContentStructureConverter";
import {HTMLToBlocks, IBlockContentStructure} from "./HTMLToBlocks";

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
                {content: HTMLToBlocks.createMarkdownContent('hello'), children: []},
                {content: HTMLToBlocks.createMarkdownContent('world'), children: []},
                {content: await HTMLToBlocks.createImageContent('dataurl:fhasdklhgdalsh'), children: []}
            ];

            const output = BlockContentStructureConverter.toHTML(blockStructure);

            assert.equal(output, '<ul><li>hello</li><li>world</li><li><img src="dataurl:fhasdklhgdalsh" /></li></ul>');
        });

        it('should convert complex blocks structure to html', () => {
            const blockStructure: ReadonlyArray<IBlockContentStructure> = [
                {content: HTMLToBlocks.createMarkdownContent("item1"), children: []},
                {
                    content: HTMLToBlocks.createMarkdownContent("[a link](https://www.google.com)"),
                    children: [
                        {content: HTMLToBlocks.createMarkdownContent("hmm"), children: []},
                        {
                            content: HTMLToBlocks.createMarkdownContent("![image](https://link.to.image)"),
                            children: [
                                {content: HTMLToBlocks.createMarkdownContent("potato"), children: []},
                            ]
                        },
                    ]
                },
                {content: HTMLToBlocks.createMarkdownContent("item3"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Test bold italics [[Wiki]]"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Hello"), children: []},
            ];

            const output = BlockContentStructureConverter.toHTML(blockStructure);

            assert.equal(output, '<ul><li>item1</li><li><a href="https://www.google.com">a link</a><ul><li>hmm</li><li><img src="https://link.to.image" alt="image"/><ul><li>potato</li></ul></li></ul></li><li>item3</li><li>Test bold italics <a contenteditable="false" class="note-link" href="#Wiki">Wiki</a></li><li>Hello</li></ul>');
        });
    });
});
