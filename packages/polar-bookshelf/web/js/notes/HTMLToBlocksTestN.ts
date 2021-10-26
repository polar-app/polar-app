import {assert} from "chai";
import {JSDOM} from "jsdom"
import {HTMLToBlocks} from "./HTMLToBlocks";
import {IBlockContent, IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";

describe('HTMLToBlocks', () => {
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

    type INoIDBlockContentStructure = {
        content: IBlockContent,
        children: ReadonlyArray<INoIDBlockContentStructure>,
    };

    const omitContentStructureIds = (structureArr: ReadonlyArray<IBlockContentStructure>): ReadonlyArray<INoIDBlockContentStructure> =>
        structureArr.map(({ content, children }) => ({ content, children: omitContentStructureIds(children)}))

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

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            const output: INoIDBlockContentStructure[] = [
                {content: HTMLToBlocks.createMarkdownContent("Fsadf"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item1"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item2"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item3"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Item4"), children: []},
            ];

            assert.deepEqual(result, output);
        });

        it('should parse nested lists (from google docs)', async () => {
            const input = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><meta charset="utf-8"><b id="docs-internal-guid-b23c597f-7fff-6ccf-5013-28c0685ab31e"><ol ltr" aria-level="1"><p dir="ltr" role="presentation"><span >item1</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span >item2</span></p></li><ol ><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span >hmm</span></p></li><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span >world</span></p></li><ol ><li dir="ltr" aria-level="3"><p dir="ltr" role="presentation"><span >potato</span></p></li></ol></ol><li dir="ltr"  aria-level="1"><p dir="ltr" role="presentation"><span >item3</span></p></li></ol></b>`;

            const output: INoIDBlockContentStructure[] = [
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

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should join the content of nested inline tags and siblings', async () => {
            const input = `
                world?
                <span>Hello</span>
                <b>Whatever<span>potato</span>
                </b>`;
            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent("world? Hello Whateverpotato"),
                    children: []
                },
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should convert <pre> elements to a markdown code block', async () => {
            const input = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><pre class="code code-html" ><code >&lt;button&gt;Press Me!&lt;/button&gt;</code></pre><pre class="code code-css" ><label >CSS</label><code >button {
  width:20px;
  height:28px;
  color:#fff;
  font-size:28px;
  padding:11px 15px;
  border-radius:5px;
  background:#14ADE5;
}</code></pre><pre class="code code-javascript" ><label >JS</label><code >&lt;button onclick="myFunction()"&gt;Post&lt;/button&gt;

&lt;script&gt;
function myFunction() {
    document.write(5 + 6);
}
&lt;/script&gt;</code></pre>`;
            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent("```\n<button>Press Me!</button>\n```"),
                    children: []
                },
                {
                    content: HTMLToBlocks.createMarkdownContent("```\nCSSbutton {\n  width:20px;\n  height:28px;\n  color:#fff;\n  font-size:28px;\n  padding:11px 15px;\n  border-radius:5px;\n  background:#14ADE5;\n}\n```"),
                    children: []
                },
                {
                    content: HTMLToBlocks.createMarkdownContent("```\nJS<button onclick=\"myFunction()\">Post</button>\n\n<script>\nfunction myFunction() {\n    document.write(5 + 6);\n}\n</script>\n```"),
                    children: []
                },
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should parse links and convert them into markdown links (from google docs)', async () => {
      const input = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><meta charset="utf-8"><b id="docs-internal-guid-bf74c453-7fff-a6a9-9923-9698855409e5"><p dir="ltr" ><span >What i</span><a href="https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png" ><span >s happening?</span></a></p><p dir="ltr" ><span >Hello world</span></p></b><br class="Apple-interchange-newline">`;

            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent("What i[s happening?](https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)"),
                    children: []
                },
                {
                    content: HTMLToBlocks.createMarkdownContent("Hello world"),
                    children: []
                },
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should ignore links with javascript code', async () => {
            const input = `<a href="jAvAsCrIpT:alert(0)>hello</a>`;

            const output: IBlockContentStructure[] = [];

            assert.deepEqual(await HTMLToBlocks.parse(input), output);
        });

        it('should parse images that have urls as their source and convert them into markdown blocks', async () => {
            const input = `an image <img src="https://preview.redd.it/bwc59363iym41.gif?format=png8&s=a7e97b88b22e3d4386aaed90bdd8cdcd5edec80d"></img>`;

            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent("an image ![](https://preview.redd.it/bwc59363iym41.gif?format=png8&s=a7e97b88b22e3d4386aaed90bdd8cdcd5edec80d)"),
                    children: []
                }
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should parse images that have dataurls as their source and convert them into image blocks', async () => {
            const dataurl = "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";
            const input = `an image <img src="${dataurl}"></img>`;

            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent('an image'),
                    children: []
                },
                {
                    content: await HTMLToBlocks.createImageContent(dataurl),
                    children: []
                }
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should work with google docs content (random 1)', async () => {
            const input = `<meta http-equiv="content-type" content="text/html; charset=utf-8"><meta charset="utf-8"><b id="docs-internal-guid-b8b2d479-7fff-d99e-d523-77699661a072"><ol ><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>item1</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span >item2</span></p></li><ol><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span >hmm</span></p></li><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span >world</span></p></li><ol ><li dir="ltr" aria-level="3"><p dir="ltr" role="presentation"><span >potato</span></p></li></ol></ol><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>item3</span></p></li></ol><br /><p dir="ltr"><span >Test </span><span>bold </span><span></span><span>italics </span><span></span><span>linethrough</span><span> underline</span></p><p dir="ltr"><span>What is going on right now</span></p><br /><br /><br /><ul ><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Hello</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span >World</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Foo</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span >bar</span></p></li></ul></b>`;

            const output: INoIDBlockContentStructure[] = [
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
                {content: HTMLToBlocks.createMarkdownContent("Test bold italics linethrough underline"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("What is going on right now"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Hello"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("World"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Foo"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("bar"), children: []},
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('should work with nested lists that have <ul>s inside of <li>s (our own block to html converter)', async () => {
            const input = `<ul><li>What i<a href=\"https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png\">s happening?</a><ul><ul><ul><li>Foo</li></ul><li>Bar<ul><ul><li>5ffasdfas</li></ul><li>World<ul><li>foo</li></ul></li></ul></li></ul><li>Dude</li></ul></li></ul>`;

            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent("What i[s happening?](https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)"),
                    children: [
                        {content: HTMLToBlocks.createMarkdownContent("Foo"), children: []},
                        {
                            content: HTMLToBlocks.createMarkdownContent("Bar"),
                            children: [
                                {content: HTMLToBlocks.createMarkdownContent("5ffasdfas"), children: []},
                                {
                                    content: HTMLToBlocks.createMarkdownContent("World"),
                                    children: [
                                        {content: HTMLToBlocks.createMarkdownContent("foo"), children: []},
                                    ]
                                },
                            ]
                        },
                        {content: HTMLToBlocks.createMarkdownContent("Dude"), children: []},
                    ]
                },
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });

        it('Random nested lists sample', async () => {
            const input = `<html>
            <body>
            <!--StartFragment--><ul><div 
                  rem="true"
                  crt="null"
                  tags="[]"
                  valueType="undefined"
                  
                  
                >
                <li>cs linethroughunderline</li>
                </div><ul><div 
                  rem="true"
                  crt="null"
                  tags="[]"
                  valueType="undefined"
                  
                  
                >
                <li>test</li>
                </div><div 
                  rem="true"
                  crt="null"
                  tags="[]"
                  valueType="undefined"
                  
                  
                >
                <li>world</li>
                </div><ul><div 
                  rem="true"
                  crt="null"
                  tags="[]"
                  valueType="undefined"
                  
                  
                >
                <li>maybe</li>
                </div></ul></ul></ul><!--EndFragment-->
            </body>
            </html>`;

            const output: INoIDBlockContentStructure[] = [
                {
                    content: HTMLToBlocks.createMarkdownContent("cs linethroughunderline"),
                    children: [
                        {content: HTMLToBlocks.createMarkdownContent("test"), children: []},
                        {
                            content: HTMLToBlocks.createMarkdownContent("world"),
                            children: [
                                {content: HTMLToBlocks.createMarkdownContent("maybe"), children: []},
                            ]
                        },
                    ]
                },
            ];

            const result = omitContentStructureIds(await HTMLToBlocks.parse(input));

            assert.deepEqual(result, output);
        });
    });
});
