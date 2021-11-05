import { ExtensionContentCapture } from "./ExtensionContentCapture";
import { assert } from 'chai';

describe("Extension Capture", function() {

    it("Basic image capture", async () => {
        const imgURL = 'https://discord.com/assets/652f40427e1f5186ad54836074898279.png';

        document.head.innerHTML = `<meta property="og:image" content="${imgURL}">`;

        const capture = ExtensionContentCapture.capture();

        assert.equal(capture.image, imgURL);
    });
    
    it("Twitter meta scheme image capture", async () => {
        const imgURL = 'https://twitter.com/';

        document.head.innerHTML = `<meta property="twitter:image" content="${imgURL}">`;

        const capture = ExtensionContentCapture.capture();

        assert.equal(capture.image, imgURL);
    });

    it("Twitter meta scheme title capture", async () => {
        const twitterTitle = 'twitter title';

        document.head.innerHTML = `<meta property="twitter:title" content="${twitterTitle}">`;

        const capture = ExtensionContentCapture.capture();

        assert.equal(capture.title, twitterTitle);
    });
});