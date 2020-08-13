import {assert} from 'chai';
import {DocViewerSnapshots} from "./DocViewerSnapshots";
import {UUIDs} from "../../../web/js/metadata/UUIDs";


describe('DocViewerSnapshots', function() {

    it('basic', function() {

        assert.isFalse(DocViewerSnapshots.isStaleUpdate(undefined, 'z2020-07-15T23:13:03.779Z+000001-327370643360'));

        assert.equal('z2020-07-15T23:13:03.779Z+000001-327370643360', 'z2020-07-15T23:13:03.779Z+000001-327370643360');

        assert.equal(0, UUIDs.compare('z2020-07-15T23:13:03.779Z+000001-327370643360', 'z2020-07-15T23:13:03.779Z+000001-327370643360'));

        assert.isTrue(DocViewerSnapshots.isStaleUpdate('z2020-07-15T23:13:03.779Z+000002-327370643360', 'z2020-07-15T23:13:03.779Z+000001-327370643360'));

    });

    it('stale for same date', function() {

        const d0 = 'z2020-07-15T23:13:03.779Z+000001-327370643360';
        const d1 = 'z2020-07-15T23:13:03.779Z+000001-327370643360';
        assert.equal(d0, d1);
        assert.isTrue(DocViewerSnapshots.isStaleUpdate(d0, d1));

    });

});
