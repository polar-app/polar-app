import {assert} from 'chai';
import {MarkdownContentConverter} from "./MarkdownContentConverter";

describe('MarkdownContentEscaper', function() {

    function testTwoWayConversionFromMarkdown(markdown: string, expected: string) {

        const escaped = MarkdownContentConverter.toHTML(markdown);
        assert.equal(escaped, expected);

        const unescaped = MarkdownContentConverter.toMarkdown(escaped);
        assert.equal(unescaped, markdown);

    }

    function testTwoWayConversionFromHTML(html: string, expected: string) {

        const convertedMarkdown = MarkdownContentConverter.toMarkdown(html);
        assert.equal(convertedMarkdown, expected);

        // const unescaped = MarkdownContentEscaper.escape(escaped);
        // assert.equal(unescaped, input);

    }


    it("escape and unescape", async function() {

        testTwoWayConversionFromMarkdown("This is some **bold** text and this is a wiki link [[Hello World]]",
                                         "This is some <b>bold</b> text and this is a wiki link <a href=\"#Hello World\">Hello World</a>")

    });

    it("with single quote", () => {

        const input = "hello 'world'"

        const escaped = MarkdownContentConverter.toHTML(input);
        assert.equal(escaped, "hello 'world'");

        const unescaped = MarkdownContentConverter.toMarkdown(escaped);
        assert.equal(unescaped, input);

    });

    it("with spans", () => {

        const unescaped = MarkdownContentConverter.toMarkdown("this is some <span>text</span>");
        assert.equal(unescaped, "this is some text");

    });

});

