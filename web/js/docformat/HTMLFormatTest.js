const assert = require('assert');
const {JSDOM} = require("jsdom");
const {HTMLFormat} = require("./HTMLFormat");

describe('HTMLFormat', function() {

    // FIXME: JSDOM went to 100% cpu on my workstation with this test however
    // running it MANUALLY as a single test from the command line works fine.

    describe('currentDocFingerprint', function() {

        it("get", function () {

            let dom = new JSDOM(HTML);

            // global.document = dom.window.document;
            //
            // let htmlFormat = new HTMLFormat();
            //
            // assert.equal(htmlFormat.currentDocFingerprint(), "0x0001");

        });

        it("set", async function () {
            let dom = new JSDOM(HTML);

            global.document = dom.window.document;

            let htmlFormat = new HTMLFormat();

            htmlFormat.setCurrentDocFingerprint("0x9999")

            assert.equal(htmlFormat.currentDocFingerprint(), "0x9999");

        });

    });

});

const HTML = `
<html>
    <head>
        <meta name="polar-fingerprint" content="0x0001">                
    </head>
</html>
`
