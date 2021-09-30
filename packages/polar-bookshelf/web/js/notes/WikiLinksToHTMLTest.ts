import {assert} from 'chai';
import { WikiLinksToHTML } from './WikiLinksToHTML';

describe('WikiLinksToHTML', function() {

    it("basic", function() {

        assert.equal(WikiLinksToHTML.escape("[[Hello World]]"), `<a contenteditable="false" class="note-link" href="#Hello World">Hello World</a>`);

    });

    it("escape and unescape", function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinksToHTML.escape(input);
        assert.equal(escaped, `<a contenteditable="false" class="note-link" href="#Hello World">Hello World</a>`);

        const unescaped = WikiLinksToHTML.unescape(escaped);
        assert.equal(unescaped, input, 'wot');

    });

    it("should not allow brackets inside of the special link notation", function() {
        const input = "Potato [[ test [[hello]]";
        const expected = `Potato [[ test <a contenteditable="false" class="note-link" href="#hello">hello</a>`;

        assert.equal(WikiLinksToHTML.escape(input), expected);
    });

    it("should add the correct classes for links/tags", () => {
        const input = "[[Hello]] [[#world]]";
        const expected = `<a contenteditable="false" class="note-link" href="#Hello">Hello</a> <a contenteditable="false" class="note-tag" href="#world">#world</a>`;

        assert.equal(WikiLinksToHTML.escape(input), expected);
    });
});

