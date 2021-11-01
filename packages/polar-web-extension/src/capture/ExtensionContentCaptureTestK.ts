import { ExtensionContentCapture } from "./ExtensionContentCapture";
import { assert } from 'chai';

describe("Extension Capture", function() {

    it("Basic capture", async () => {
        const imgURL = 'https://discord.com/assets/652f40427e1f5186ad54836074898279.png';

        document.head.innerHTML = `<meta property="og:image" content="${imgURL}">`;

        const capture = ExtensionContentCapture.capture();

        assert.equal(capture.image, imgURL);
    });

});