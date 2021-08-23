import {EPUBMetadata} from "./EPUBMetadata";
import {FilePaths} from "polar-shared/src/util/FilePaths";

describe('EPUBMetadata', function() {

    it("basic", async function() {

        const path = FilePaths.resolve(__dirname, '../alice.epub');
        await EPUBMetadata.getMetadata(path);

    });

});
