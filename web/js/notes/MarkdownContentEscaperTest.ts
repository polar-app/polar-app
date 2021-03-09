import {assert} from 'chai';
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";

describe('MarkdownContentEscaper', function() {

    it("escape and unescape", async function() {

        const input = "This is some **bold** text and this is a wiki link [[Hello World]]"

        const escaped = MarkdownContentEscaper.escape(input);
        assert.equal(escaped, "This is some <b>bold</b> text and this is a wiki link <a href=\"#Hello World\">Hello World</a>");

        const unescaped = MarkdownContentEscaper.unescape(escaped);
        assert.equal(unescaped, input);

    });

    it("with single quote", () => {

        const input = "hello 'world'"

        const escaped = MarkdownContentEscaper.escape(input);
        assert.equal(escaped, "hello 'world'");

        const unescaped = MarkdownContentEscaper.unescape(escaped);
        assert.equal(unescaped, input);

    });

    it("with spans", () => {

        const unescaped = MarkdownContentEscaper.unescape("this is some <span>text</span>");
        assert.equal(unescaped, "this is some text");

    });

});

