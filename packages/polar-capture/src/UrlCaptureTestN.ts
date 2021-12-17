import { UrlCapture } from './UrlCapture';
import { assert } from 'chai';


describe("Node URL capture", () => {

    it("Can capture a webpage using it URL and parse it as an epub and extract its metadata", async () => {
        const capture = await UrlCapture.fetchUrl("https://based.cooking");
        const metadata = await UrlCapture.parseMetadata(capture);
        assert.equal(metadata.nrPages, 1);
    });

    it("Can capture a PDF using it URL and extracts its metadata", async () => {
        const capture = await UrlCapture.fetchUrl("https://arxiv.org/pdf/2110.13947.pdf");
        const metadata = await UrlCapture.parseMetadata(capture);
        assert.equal(metadata.nrPages, 19);
    });
});