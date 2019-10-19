import {DatastoreFetchImports} from "./DatastoreFetchImports";
import {PreviewURLs} from "polar-webapp-links/src/docs/PreviewURLs";


describe('DatastoreFetchImports', function () {

    it('basic', async function () {
        this.timeout(500000)
        const importedDoc = await DatastoreFetchImports.doFetch('https://bitcoin.org/bitcoin.pdf');
        console.log(importedDoc);

        const {url} = importedDoc;

        const previewURL = PreviewURLs.createPreviewURL(url);
        console.log(previewURL);

    });

});
