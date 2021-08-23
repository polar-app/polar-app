import {EPUBMetadata} from "./EPUBMetadata";
import {FilePaths} from "polar-shared/src/util/FilePaths";

describe('EPUBMetadata', function() {

    it("basic", async function() {

        const path = FilePaths.resolve(__dirname, '../alice.epub');
        const url = FilePaths.toURL(path);

        console.log("path: ", path);
        console.log("url: ", url);
        await EPUBMetadata.getMetadata(url);

    });

});
