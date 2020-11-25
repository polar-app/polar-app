import {assert} from 'chai';
import {WikiLinks} from "./WikiLinks";

describe('WikiLinks', function() {

    it("basic", function() {

        assert.equal(WikiLinks.escape("[[Hello World]]"), "[Hello World](#Hello World)");

    });

    xit("escape and unescape", async function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinks.escape(input);
        assert.equal(escaped, "[Hello World](#Hello World)");

        const unescaped = WikiLinks.unescape(escaped);
        assert.equal(unescaped, input);

    });

});

