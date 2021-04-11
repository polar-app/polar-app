import {DocPreviewsSitemapGenerator} from "./DocPreviewsSitemapGenerator";

describe('DocPreviewsSitemapGenerator', function() {

    it("basic", async function() {

        await DocPreviewsSitemapGenerator.generate();

    });

});
