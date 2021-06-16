import {assert} from 'chai';
import { WikiLinksToHTML } from './WikiLinksToHTML';

describe('WikiLinksToHTML', function() {

    it("basic", function() {

        assert.equal(WikiLinksToHTML.escape("[[Hello World]]"), `<a contenteditable="false" href="#Hello World">Hello World</a>`);

    });

    it("escape and unescape", function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinksToHTML.escape(input);
        assert.equal(escaped, `<a contenteditable="false" href="#Hello World">Hello World</a>`);

        const unescaped = WikiLinksToHTML.unescape(escaped);
        assert.equal(unescaped, input);

    });

    it("should not allow brackets inside of the special link notation", function() {
        const input = "Potato [[ test [[hello]]";
        const expected = `Potato [[ test <a contenteditable="false" href="#hello">hello</a>`;

        assert.equal(WikiLinksToHTML.escape(input), expected);
    });
});

