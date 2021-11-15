import {assert} from 'chai';
import {ConsoleErrorMessages} from "./ConsoleErrorMessages";

describe("ConsoleErrorMessages", function() {

    it("isExpected", () => {
        assert.equal(ConsoleErrorMessages.isExpected("Not registering service worker - localhost/webpack-dev-server"), "Not registering service worker - localhost/webpack-dev-server")
    });

})
