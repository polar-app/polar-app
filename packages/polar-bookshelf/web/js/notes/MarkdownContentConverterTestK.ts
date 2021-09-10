import {assert} from 'chai';
import {MarkdownContentConverter} from "./MarkdownContentConverter";

describe('MarkdownContentConverter', function() {

    function testTwoWayConversionFromMarkdown(markdown: string, expected: string) {

        const convertedHTML = MarkdownContentConverter.toHTML(markdown);
        assert.equal(convertedHTML, expected);

        const convertedMarkdown = MarkdownContentConverter.toMarkdown(convertedHTML);
        assert.equal(convertedMarkdown, markdown);

    }

    function testTwoWayConversionFromHTML(html: string, expected: string) {

        const convertedMarkdown = MarkdownContentConverter.toMarkdown(html);
        assert.equal(convertedMarkdown, expected);

        const convertedHTML = MarkdownContentConverter.toHTML(convertedMarkdown);
        assert.equal(convertedHTML, html);

    }


    it("escape and unescape", async function() {

        testTwoWayConversionFromMarkdown("This is some **bold** text and this is a wiki link [[Hello World]]",
                                         "This is some <b>bold</b> text and this is a wiki link <a contenteditable=\"false\" href=\"#Hello World\">Hello World</a>")

    });

    it("quote", async function() {

        testTwoWayConversionFromHTML("this is a \" \"",
                                     "this is a \" \"")
    });

    it("amp", async function() {

        testTwoWayConversionFromHTML("this & that & the other",
                                     "this & that & the other")

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

    it('Should not collapse edge whitespace when converting', () => {
        const data = `    <a contenteditable="false" href="#polar">polar</a>     '    world    `;
        const markdown = MarkdownContentConverter.toMarkdown(data);
        assert.equal(markdown, `    [[polar]] ' world    `);

        const html = MarkdownContentConverter.toHTML(markdown);
        assert.equal(html, `    <a contenteditable="false" href="#polar">polar</a> ' world    `);
    });

});

