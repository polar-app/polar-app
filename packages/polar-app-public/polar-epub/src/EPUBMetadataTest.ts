import {EPUBMetadata} from "./EPUBMetadata";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import * as assert from "assert";

describe('EPUBMetadata', function () {

    it("GIVEN a valid epub THEN it should return the metadata object", async function () {
        // Arrange
        const path = FilePaths.resolve(__dirname, '../alice.epub');

        // Act
        const metadata = await EPUBMetadata.getMetadata(path);

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

});
