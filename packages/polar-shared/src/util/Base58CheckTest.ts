import {assert} from 'chai';
import {Base58Check} from "./Base58Check";

describe('Base58Check', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        const input = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxasdfasdfxxxxx'

        assert.equal(Base58Check.encode(input), "1Wh4bh");

    });

});
