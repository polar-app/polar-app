import {assert} from 'chai';
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";

describe('MarkdownContentEscaper', function() {

    it("escape and unescape", async function() {

        const input = "This is some **bold** text and this is a wiki link [[Hello World]]"

        const escaped = MarkdownContentEscaper.escape(input);
        assert.equal(escaped, "<div>This is some <strong>bold</strong> text and this is a wiki link <a href=\"#Hello World\">Hello World</a></div>");

        const unescaped = MarkdownContentEscaper.unescape(escaped);
        assert.equal(unescaped, input);

    });

});

