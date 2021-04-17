import {Fingerprints} from './Fingerprints';

import {assert} from 'chai';

describe('Fingerprints', function() {

    it("toFilename", async function () {

        assert.equal(Fingerprints.toFilename("hello.chtml", "0x0001"), "hello-0x0001.chtml");

    });

    it("fromFilename", async function () {

        assert.equal(Fingerprints.fromFilename("hello-0x0001.chtml"), "0x0001");

    });

    it("create", async function () {

        assert.equal(Fingerprints.create("xxxxx"), "1Ufomfbkk3Js2YGDZr4c");

    });

});
