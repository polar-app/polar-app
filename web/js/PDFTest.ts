import {assert} from 'chai';
import {Rects} from './Rects';
import {assertJSON} from './test/Assertions';
import {Rect} from './Rect';
import {IRect} from './util/rects/IRect';
import {RectArt} from './util/RectArt';
import {MOCK_RECTS} from './MockRects';

import * as PDFJS from 'pdfjs-dist';
import {PDFJSStatic} from 'pdfjs-dist';
import {Files} from './util/Files';

const pdfjs: PDFJSStatic = require('pdfjs-dist');

describe('PDF', function() {

    it("basic", async function () {

        const foo: PDFJSStatic = <any> PDFJS;

        const buffer = await Files.readFileAsync("/home/burton/Downloads/1010.3003v1.pdf")
        const uint8 = toArray(buffer)

        const doc = await pdfjs.getDocument(uint8!)

        const metadata = await doc.getMetadata()

        console.log("numPages: " + doc.numPages);
        console.log("fingerprint: " + doc.fingerprint);

        //assert.ok(PDFJS.getDocument);

    });

});


function toArray(buf: Buffer) {
    if (!buf) return undefined;
    if (buf.constructor.name === 'Uint8Array'
        || buf.constructor === Uint8Array) {
        return buf;
    }
    if (typeof buf === 'string') buf = Buffer.from(buf);
    var a = new Uint8Array(buf.length);
    for (var i = 0; i < buf.length; i++) a[i] = buf[i];
    return a;
};
