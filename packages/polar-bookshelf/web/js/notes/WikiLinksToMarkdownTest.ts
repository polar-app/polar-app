import {assert} from 'chai';
import {WikiLinksToMarkdown} from "./WikiLinksToMarkdown";

describe('WikiLinksToMarkdown', function() {

    it("escape", function() {
        assert.equal(WikiLinksToMarkdown.escape("[[Hello World]]"), "[Hello World](#Hello World)");
    });

    it("unescape", function() {
        assert.equal(WikiLinksToMarkdown.unescape("[Hello World](#Hello World)"), "[[Hello World]]");
    });

    it("escape and unescape", function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinksToMarkdown.escape(input);
        assert.equal(escaped, "[Hello World](#Hello World)");

        const unescaped = WikiLinksToMarkdown.unescape(escaped);
        assert.equal(unescaped, input);

    });

    /*
     * This happens when we're trying to create a link before an existing link
     * It should ignore the opening bracket (which is the trigger for creating links)
     */
    it("should not allow brackets inside of links", () => {
        const input = "Potatos are really [Nice [Hello World](#Hello World)";
        const expected = "Potatos are really [Nice [[Hello World]]";
        assert.equal(WikiLinksToMarkdown.unescape(input), expected);
    });

    it("should allow escaped garbage within links", () => {
        const input = "Potatos are really [Nice [\\[\\]\\(\\)Hello World](#\\[\\]\\(\\)Hello World)";
        const expected = "Potatos are really [Nice [[\\[\\]\\(\\)Hello World]]";
        assert.equal(WikiLinksToMarkdown.unescape(input), expected);
    });

    it("random test case 1", function () {
        const input = "]Nice [Hello World](#Hello World) Foo ]][";

        const expected = "]Nice [[Hello World]] Foo ]][";
        assert.equal(WikiLinksToMarkdown.unescape(input), expected);
    });

    it("random test case 2", function () {
        const input = ")Nice [Hello World](#Hello World) Foo ))(";

        const expected = ")Nice [[Hello World]] Foo ))(";
        assert.equal(WikiLinksToMarkdown.unescape(input), expected);
    });
});

