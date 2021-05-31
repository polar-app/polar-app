import {assert} from 'chai';
import {ConstructorOptions, JSDOM} from "jsdom";
import {BlockContentCanonicalizer} from "./BlockContentCanonicalizer";

declare var global: any;

describe('BlockContentCanonicalizer', function() {

    function parseHTML(html: string) {

        const url = 'https://www.example.com';
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(`<html><body>${html}</body></html>`, opts);

        global.window = dom.window;
        global.document = dom.window.document;

        return dom.window.document.body as HTMLElement;

    }

    function doCanonicalize(html: string) {
        return BlockContentCanonicalizer.canonicalizeElement(parseHTML(html));
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
        assert.equal(doCanonicalize('<div>hello <span>world</span></div>').innerHTML, '<div>hello world</div>')
    });

    it("test with nested spans", function() {
        assert.equal(doCanonicalize('<div>hello <span>world <span>again</span></span></div>').innerHTML, '<div>hello world again</div>')
    });

    it("Random test 1", function() {
        assert.equal(
            doCanonicalize('Hello <a href=\"#World\">World</a> What is going on right <span>[[ now ]]</span>').innerHTML,
            'Hello <a href="#World">World</a> What is going on right [[ now ]]',
        );
    });
});



