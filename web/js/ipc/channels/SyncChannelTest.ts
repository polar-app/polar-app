import {func} from 'prop-types';
import {assert} from 'chai';
import {MockChannels} from './MockChannels';
import {SyncChannel} from './SyncChannel';
import {Promises} from '../../util/Promises';

describe('SyncChannel', function() {

    it("create sync channels L->R", async function () {

        let mockChannels: MockChannels<any, string> = MockChannels.create();

        let left = new SyncChannel(mockChannels.left);
        let right = new SyncChannel(mockChannels.right);

        let leftPromise = Promises.withTimeout(1, async () => await left.sync())
        let rightPromise = Promises.withTimeout(1, async () => await right.sync())

        await Promise.all([leftPromise, rightPromise]);

    });

    it("create sync channels R->L", async function () {

        let mockChannels: MockChannels<any, string> = MockChannels.create();

        let left = new SyncChannel(mockChannels.left);
        let right = new SyncChannel(mockChannels.right);

        let leftPromise = Promises.withTimeout(1, async () => await left.sync())
        let rightPromise = Promises.withTimeout(1, async () => await right.sync())

        await Promise.all([rightPromise, leftPromise]);

    });


});
