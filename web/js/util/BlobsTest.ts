import {assert} from 'chai';
import {Attributes} from './Attributes';
import {Blobs} from './Blobs';

const {JSDOM} = require("jsdom");

xdescribe('Blobs', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        const blob = new Blob(["asdf"], {type : 'text/plain'});

        const arrayBuffer = await Blobs.toArrayBuffer(blob);

        Buffer.from(arrayBuffer);

    });

});
