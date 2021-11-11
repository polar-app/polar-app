import {assert} from 'chai';
import {getMetadata} from "polar-page-metadata-parser/src/parsers/PageParser";

describe('Page Metadata', function() {

    it("basic", function() {

        const parser = new DOMParser();
        
        const doc = parser.parseFromString(`
        <html>
            <head>
                <title>this is the title</title>
            </head>
            <body>
                <p>this is some text</p>
            </body>
        </html>`, 'text/html');

        const pageMetadata = getMetadata(doc, 'http://localhost');

        assert.equal(pageMetadata.title, 'this is the title');
    });

});
