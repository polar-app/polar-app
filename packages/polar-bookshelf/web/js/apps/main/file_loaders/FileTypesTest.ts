import {assert} from 'chai';
import {FileTypes} from "./FileTypes";

describe('FileTypes', function() {

    it("basic", async function() {

        assert.equal(FileTypes.create('foo.pdf'), 'pdf');
        assert.equal(FileTypes.create('foo.PDF'), 'pdf');
        assert.equal(FileTypes.create('foo.pDf'), 'pdf');
        assert.equal(FileTypes.create('foo.PdF'), 'pdf');

        assert.equal(FileTypes.create('foo.epub'), 'epub');
        assert.equal(FileTypes.create('foo.EPUB'), 'epub');
        assert.equal(FileTypes.create('foo.ePuB'), 'epub');
        assert.equal(FileTypes.create('foo.EpUB'), 'epub');

    });

});