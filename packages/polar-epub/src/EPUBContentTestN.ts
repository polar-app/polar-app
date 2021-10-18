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

        const contentStream = await EPUBContent.getStreams(path);

        assert.equal(contentStream.length, chapters);

        const titlePageStream = contentStream[0].stream;

        titlePageStream.on('readable', () => {
            const buff = titlePageStream.read();

            if (buff !== null) {
                assert.equal(buff.toString(), titlePageData.toString());
            }
        });
    });
});