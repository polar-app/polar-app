import {EPUBMetadataUsingNode} from "./EPUBMetadataUsingNode";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import * as assert from "assert";

describe('EPUBMetadataUsingNode', function () {

    it("GIVEN a valid epub THEN it should return its metadata", async function () {
        // Arrange
        const path = FilePaths.resolve(__dirname, '../alice.epub');

        // Act
        const metadata = await EPUBMetadataUsingNode.getMetadata(path);

        // Assert
        assert.deepEqual(metadata, {
            creator: 'Lewis Carroll',
            description: undefined,
            doi: 'edu.nyu.itp.future-of-publishing.alice-in-wonderland',
            fingerprint: '1241JKCd5XYvKbwXjqeyH2L5C6G7GUPBcRifAYHeQrQoacuDuEc',
            link: 'http://www.gutenberg.org/files/19033/19033-h/19033-h.htm',
            nrPages: 11,
            props: {},
            title: "Alice's Adventures in Wonderland"
        });

    });

    it('GIVEN a valid epub THEN it should extract the HTML contents of chapters', async function () {
        const CHAPTER_COUNT = 11;

        // Arrange
        const epubFile = FilePaths.resolve(__dirname, '../alice.epub');

        // Act
        const chapterReferences = await EPUBMetadataUsingNode.getChapterReferences(epubFile);

        // Assert
        assert.equal(chapterReferences.length, CHAPTER_COUNT, 'Chapters within the .epub do not match');

        // For every chapter extract its HTML contents and validate that it's actually HTML
        for (let chapterReference of chapterReferences) {
            const chapterHTMLContents = await EPUBMetadataUsingNode.getChapterContents(
                epubFile,
                chapterReference.file
            );

            const hasHTML = chapterHTMLContents.toString().includes('<body>');

            // Assert
            assert.equal(
                hasHTML,
                true,
                'Chapter returned from EPUBMetadata.getChapterContents() is not a valid HTML'
            );
        }
    })

});
