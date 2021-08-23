import {EPUBMetadata} from "./EPUBMetadata";
import {FilePaths} from "polar-shared/src/util/FilePaths";

describe('EPUBMetadata', function() {

    it("basic", async function() {

        (global as any).Blob = class {};

        const path = FilePaths.resolve(__dirname, '../alice.epub');
        await EPUBMetadata.getMetadata(path);

    });

});
