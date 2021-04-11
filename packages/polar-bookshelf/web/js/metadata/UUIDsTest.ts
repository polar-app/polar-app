import {assert} from 'chai';
import {UUIDs} from './UUIDs';
import {Promises} from '../util/Promises';

describe('UUIDs', function() {

    it('Test UUID', async function() {

        const u0 = UUIDs.create();
        await Promises.waitFor(200);
        const u1 = UUIDs.create();

        assert.notEqual(u0, u1);

        assert.equal(UUIDs.compare(u0, u1), -1);
        assert.equal(UUIDs.compare(u0, u0), 0);
        assert.equal(UUIDs.compare(u1, u0), 1);

    });

    describe("cmp", function() {

        it('basic', async function() {
            // FIXME: I think this might be INVERSE of what normal sring comparison is...
            assert.equal(UUIDs.cmp('0000', '0000'), 0);
            assert.equal(UUIDs.cmp('0001', '0000'), 1);
            assert.equal(UUIDs.cmp('0000', '0001'), -1);
        });

    });

    describe("cmp2", function() {

        it('basic', async function() {
            // FIXME: I think this might be INVERSE of what normal sring comparison is...
            assert.equal(UUIDs.cmp2('0000', '0000'), 0);
            assert.equal(UUIDs.cmp2('0001', '0000'), -1);
            assert.equal(UUIDs.cmp2('0000', '0001'), 1);
        });

    });


});
