import {assert} from 'chai';
import { WikiLinksToHTML } from './WikiLinksToHTML';

describe('WikiLinksToHTML', function() {

    it("basic", function() {

        assert.equal(WikiLinksToHTML.escape("[[Hello World]]"), "<a href=\"#Hello World\">Hello World</a>");

    });

    it("escape and unescape", async function() {

        const input = "[[Hello World]]"

        const escaped = WikiLinksToHTML.escape(input);
        assert.equal(escaped, "<a href=\"#Hello World\">Hello World</a>");

        const unescaped = WikiLinksToHTML.unescape(escaped);
        assert.equal(unescaped, input);

    });

});

