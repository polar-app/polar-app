import {assert} from 'chai';
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";

describe('WikiLinksToMarkdown', function() {

    it("basic", function() {

        assert.equal(WikiLinksToMarkdown.escape("[[Hello World]]"), "[Hello World](#Hello World)");

    });

    xit("escape and unescape", async function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinksToMarkdown.escape(input);
        assert.equal(escaped, "[Hello World](#Hello World)");

        const unescaped = WikiLinksToMarkdown.unescape(escaped);
        assert.equal(unescaped, input);

    });

});

