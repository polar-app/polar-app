// import { assert } from 'chai';
import { urlCapture } from './urlCapture';


describe("Node URL capture", () => {

    it("Can capture a webpage using it URL", async () => {
        const res = await urlCapture.fetchDocument("https://based.cooking/italian-bread.html");

        console.log(res);
    });
});