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

    it('self...', function() {

        const currUUID = 'z2020-10-17T16:00:20.885Z+000002-669108819983';
        const nextUUID = 'z2020-10-17T16:01:08.120Z+000000-427357489886';

        assert.equal(UUIDs.cmp2('z2020-10-17T16:00:20.885Z', 'z2020-10-17T16:01:08.120Z'), 1);
        assert.equal(UUIDs.cmp2(currUUID, nextUUID), 1);

        assert.equal(DocViewerSnapshots.computeUpdateType3(currUUID, nextUUID).type, 'fresh');

    });

});


