import { FilePaths } from 'polar-shared/src/util/FilePaths';
import { EPUBShingleParser } from './EPUBShingleParser';

describe("EPUB Shingle Parser", function() {

    this.timeout(120000);

    it("basic", async () => {
        const path = FilePaths.resolve(__dirname, '../../polar-epub/alice.epub');

        await EPUBShingleParser.parse(path);
    });
});
