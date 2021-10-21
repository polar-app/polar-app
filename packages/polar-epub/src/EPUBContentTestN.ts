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
});