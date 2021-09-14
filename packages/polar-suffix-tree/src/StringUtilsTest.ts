import {assert} from 'chai';
import {StringUtils} from "./StringUtils";

describe("StringUtils", function() {
    it("basic", () => {

        assert.isTrue(StringUtils.regionMatches('hello', 0, 'hello', 0, 2));

        assert.isTrue(StringUtils.regionMatches('hello', 0, 'xhello', 1, 2));

        assert.isTrue(StringUtils.regionMatches('hello', 0, 'xhello', 1, 5));

        assert.isTrue(StringUtils.regionMatches('xhello', 1, 'xhello', 1, 5));

    });
})
