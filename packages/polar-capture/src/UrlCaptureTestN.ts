import { UrlCapture } from './UrlCapture';


describe("Node URL capture", () => {

    it("Can capture a webpage using it URL and parse it as an epub", async () => {
        // const capture = await UrlCapture.fetchUrl("https://based.cooking");
        // const metadata = await UrlCapture.parseMetadata(capture);
        // console.log(metadata);
    });

    it("Can capture a PDF using it URL", async () => {
        const capture = await UrlCapture.fetchUrl("https://arxiv.org/pdf/2110.13947.pdf");
        const metadata = await UrlCapture.parseMetadata(capture);
        console.log(metadata);
    });
});