import {assert} from 'chai';
import {Base16} from "./Base16";

describe('Base16', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        assert.equal("61736466", Base16.encode("asdf"));
        assert.equal("68656c6c6f776f726c64", Base16.encode("helloworld"));

    });

});
