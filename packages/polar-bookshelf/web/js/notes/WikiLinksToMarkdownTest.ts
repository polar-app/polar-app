import {assert} from 'chai';
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";

describe('WikiLinksToMarkdown', function() {

    it("escape", function() {
        assert.equal(WikiLinksToMarkdown.escape("[[Hello World]]"), "[Hello World](#Hello World)");
    });

    it("unescape", function() {
        assert.equal(WikiLinksToMarkdown.unescape("[Hello World](#Hello World)"), "[[Hello World]]");
    });

    it("escape and unescape", async function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinksToMarkdown.escape(input);
        assert.equal(escaped, "[Hello World](#Hello World)");

        const unescaped = WikiLinksToMarkdown.unescape(escaped);
        assert.equal(unescaped, input);

    });

});

