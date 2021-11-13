import {FilePaths} from "polar-shared/src/util/FilePaths";
import {EPUBMetadata} from "./EPUBMetadata";
import {assert} from "chai";

describe('EPUBMetadata', function () {

    it("GIVEN a valid epub on either Node or the Browser (karma) THEN it should return its metadata", async function () {

        const path = FilePaths.resolve(__dirname, '../alice.epub');

        const result = await EPUBMetadata.getMetadata(path);

        assert.isDefined(result);

    });

});
