import {FilePaths} from "polar-shared/src/util/FilePaths";
import {EPUBThumbnailer} from "./EPUBThumbnailer";
import * as fs from "fs";
import * as assert from "assert";
import Crypto from 'crypto';

describe('EPUBThumbnailer', function () {

    it("given a valid epub THEN extract its thumbnail", async function () {

        // Arrange
        const epubFile = FilePaths.resolve(__dirname, '../alice.epub');
        const tmpFileName = `tmp.${Crypto.randomBytes(6)
            .readUIntLE(0, 6)
            .toString(36)}.jpg`;
        const tmpFile = FilePaths.createTempName(tmpFileName);

        // Act
        await EPUBThumbnailer.extractToFile(epubFile, tmpFile);

        // Assert
        try {
            const exists = fs.existsSync(tmpFile);
            assert.equal(exists, true);
        } catch (err) {
            console.error(err)
            assert.fail('Thumbnail file not extracted');
        }

        // Cleanup
        try {
            fs.unlinkSync(tmpFile);
        } catch (e) {
        }
    });

});
