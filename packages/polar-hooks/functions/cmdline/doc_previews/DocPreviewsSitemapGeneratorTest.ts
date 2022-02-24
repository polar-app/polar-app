import {DocPreviewsSitemapGenerator} from "./DocPreviewsSitemapGenerator";

xdescribe('DocPreviewsSitemapGenerator', function() {

    it("basic", async function() {

        await DocPreviewsSitemapGenerator.generate();

    });

});
