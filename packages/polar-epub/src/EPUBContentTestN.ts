import {FilePaths} from "polar-shared/src/util/FilePaths";
import {assert} from 'chai';
import StreamZip from 'node-stream-zip';
import {EPUBContent} from './EPUBContent';

describe('EPUBContent', () => {

    it("Can read EPUB references to streams", async () => {

        const chapters = 11;

        const path = FilePaths.resolve(__dirname, '../alice.epub');

        // eslint-disable-next-line new-cap
        const zip = new StreamZip.async({ file: path });

        const titlePageData = await zip.entryData('OPS/titlepage.xhtml');

        await zip.close();

        const contentStream = await EPUBContent.get(path);

        assert.equal(contentStream.length, chapters);

        const titlePageContent = await contentStream[0].html();

        assert.equal(titlePageContent, titlePageData.toString('utf-8'));
    });

    it("Can generate EPUB CFI XML root fragment", async () => {
        const path = FilePaths.resolve(__dirname, '../alice.epub');

        const firstChapterCFI = await EPUBContent.generateCFIXMLFragment(path, "chapter_001");

        const secondChapterCFI = await EPUBContent.generateCFIXMLFragment(path, "chapter_002");

        const lastChapterCFI = await EPUBContent.generateCFIXMLFragment(path, "chapter_010");

        assert.equal(firstChapterCFI, "/6/8[chapter_001]!");

        assert.equal(secondChapterCFI, "/6/10[chapter_002]!");

        assert.equal(lastChapterCFI, "/6/26[chapter_010]!");
    });

    it("Can compute CFI and parse text", async () => {
        const path = FilePaths.resolve(__dirname, '../alice.epub');

        const content = await EPUBContent.get(path);

        const parsedEpub = await EPUBContent.parseContent(content[1]);

        assert.equal(parsedEpub[0].cfi, 'epubcfi(/6/8[chapter_001]!/4/2/2)');

        assert.equal(parsedEpub[0].text, 'Down The Rabbit-Hole');
    });

    it("Parser traverses DOM tree in-order with correct CFI path", async () => {
       const path = FilePaths.resolve(__dirname, '../alice.epub');

       const html = async () => {
            return `
            <html>
                <head>
                </head>
                <body>
                    <div> 
                        first sentence.

                        <div>
                            second nested sentence.

                            <div>
                                <div>
                                    rolling in the deep.
                                </div>
                            </div>
                        </div>

                        last sentence.
                    </div>
                </body>
            </html>
            `;
        }

        const content = {
            id: 'chapter_001',
            sharedCfi: '/6/8[chapter_001]!',
            html: () => html()
        };

        const parsedEpub = await EPUBContent.parseContent(content);

        assert.equal(parsedEpub[0].cfi, 'epubcfi(/6/8[chapter_001]!/4/2)');
        assert.equal(parsedEpub[0].text, 'first sentence.');

        assert.equal(parsedEpub[1].cfi, 'epubcfi(/6/8[chapter_001]!/4/2/2)');
        assert.equal(parsedEpub[1].text, 'second nested sentence.');

        assert.equal(parsedEpub[2].cfi, 'epubcfi(/6/8[chapter_001]!/4/2/2/2/2)');
        assert.equal(parsedEpub[2].text, 'rolling in the deep.');

        assert.equal(parsedEpub[3].cfi, 'epubcfi(/6/8[chapter_001]!/4/2)');
        assert.equal(parsedEpub[3].text, 'last sentence.');
    });

    it("Reads from generator", async () => {
        const path = FilePaths.resolve(__dirname, '../alice.epub');

        let iter =  EPUBContent.parse(path);

        for await (const item of iter) {
            assert.isArray(item);
        }
    });
});
