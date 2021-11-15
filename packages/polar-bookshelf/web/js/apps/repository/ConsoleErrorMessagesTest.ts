import {assert} from 'chai';
import {ConsoleErrorMessages} from "./ConsoleErrorMessages";

describe("ConsoleErrorMessages", function() {

    it("isExpected", () => {
        assert.isTrue(ConsoleErrorMessages.isExpected(""))
    });

})
