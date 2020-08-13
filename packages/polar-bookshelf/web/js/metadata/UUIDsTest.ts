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

});
