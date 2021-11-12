import { assert } from 'chai';
import { urlCapture } from './urlCapture';


describe("Node URL capture", () => {

    it("Can capture a webpage using it URL and parse it as an epub", async () => {
        await urlCapture.fetchUrl("https://based.cooking");
    });

    it("Can capture a PDF using it URL", async () => {
        await urlCapture.fetchUrl("https://arxiv.org/pdf/1912.06680.pdf");
    });
});