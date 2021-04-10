import {assert} from 'chai';
import {ConstructorOptions, JSDOM} from "jsdom";
import {NoteContentCanonicalizer} from "./NoteContentCanonicalizer";

declare var global: any;

describe('NoteContentCanonicalizer', function() {

    function parseHTML(html: string) {

        const url = 'https://www.example.com';
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(`<html><body>${html}</body></html>`, opts);

        global.window = dom.window;
        global.document = dom.window.document;

        return dom.window.document.body as HTMLElement;

    }

    function doCanonicalize(html: string) {
        return NoteContentCanonicalizer.canonicalizeElement(parseHTML(html));
    }

    it("basic parse", function() {
        assert.isDefined(parseHTML('<div>hello world</div>'))
        assert.equal(parseHTML('<div>hello world</div>').innerHTML, '<div>hello world</div>')
    });


    it("test basic", function() {
        assert.isDefined(doCanonicalize('<div>hello world</div>'))
        assert.equal(doCanonicalize('<div>hello <b>world</b></div>').innerHTML, '<div>hello <b>world</b></div>')
    });

    it("test with span", function() {
        // assert.isDefined(doCanonicalize('<div>hello world</div>'))
        assert.equal(doCanonicalize('<div>hello <span>world</span></div>').innerHTML, '<div>hello world</div>')
    });

    // it("test with nested spans", function() {
    //     assert.isDefined(doCanonicalize('<div>hello world</div>'))
    //     assert.equal(doCanonicalize('<div>hello <span>world <span>again</span></span></div>').innerHTML, '<div>hello world again</div>')
    // });

});



