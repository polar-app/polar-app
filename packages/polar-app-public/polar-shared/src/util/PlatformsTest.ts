import {assert} from 'chai';
import {Platform, Platforms} from './Platforms';

describe('Platforms', function() {

    it("toSymbol", async function() {

        assert.equal("WINDOWS", Platforms.toSymbol(Platform.WINDOWS));
        assert.equal("LINUX",  Platforms.toSymbol(Platform.LINUX));

        console.log("Current platform: " + Platforms.toSymbol(Platforms.get()));

    });


    it("getWithProcessPlatform", async function() {

        assert.equal(Platforms.getWithProcessPlatform('linux'),  Platform.LINUX);
        assert.equal(Platforms.getWithProcessPlatform('darwin'),  Platform.MACOS);
        assert.equal(Platforms.getWithProcessPlatform('win32'),  Platform.WINDOWS);

    });

    it("getWithUserAgent", async function() {
        assert.equal(Platforms.getWithUserAgent('Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30\n'),  Platform.ANDROID);
        assert.equal(Platforms.getWithUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36"),  Platform.MACOS);
    });

});
