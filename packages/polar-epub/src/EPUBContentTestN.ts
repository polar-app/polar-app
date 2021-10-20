import {FilePaths} from "polar-shared/src/util/FilePaths";
import { assert } from 'chai';
import StreamZip from 'node-stream-zip';
import { EPUBContent } from './EPUBContent';

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
});