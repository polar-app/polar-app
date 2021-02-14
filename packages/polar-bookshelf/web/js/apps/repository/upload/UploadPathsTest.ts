import {UploadPaths} from "./UploadPaths";
import {assert} from 'chai';

describe('UploadPaths', function() {

    it("basic", function() {

        assert.isUndefined(UploadPaths.parse('/foo.txt'));
        assert.equal(UploadPaths.parse('/bar/foo.txt'), 'bar');
        assert.equal(UploadPaths.parse('bar/foo.txt'), 'bar');

        assert.equal(UploadPaths.parse('/bar/cat/foo.txt'), 'bar/cat');
        assert.equal(UploadPaths.parse('bar/cat/foo.txt'), 'bar/cat');

    });

});
