import {AsyncSerializer} from './AsyncSerializer';

import {assert} from 'chai';
import {Latch} from './Latch';
import {assertJSON} from '../test/Assertions';

describe('AsyncSerializer', function() {

    it('with no existing entries', async function() {

        const queue = new AsyncSerializer();

        let executed: boolean = false;

        await queue.execute(async () => executed = true);

        assert.ok(executed);

    });

    it('with two executions and the second completing before the first', async function() {

        const latch = new Latch();
        const queue = new AsyncSerializer();

        const order: number[] = [];

        const latch0 = new Latch();
        const latch1 = new Latch();

        queue.execute(async () => await latch0.get())
            .then(() => {
                order.push(0);
            })
            .catch(err => latch.reject(err));

        queue.execute(async () => await latch1.get())
            .then(() => {
                order.push(1);
                latch.resolve(true);
            })
            .catch(err => latch.reject(err));

        latch1.resolve(true);
        latch0.resolve(true);

        await latch.get();

        assertJSON(order, [0, 1]);

    });

    it('with normal failed execution not blocking us', async function() {

        const latch = new Latch();
        const queue = new AsyncSerializer();

        const order: number[] = [];

        const latch0 = new Latch();
        const latch1 = new Latch();

        let error: Error | undefined;

        queue.execute(async () => await latch0.get())
            .catch(err => error = err);

        queue.execute(async () => await latch1.get())
            .then(() => {
                order.push(1);
                latch.resolve(true);
            })
            .catch(err => latch.reject(err));

        latch1.resolve(true);
        latch0.reject(new Error("this is an error"));

        await latch.get();

        assertJSON(order, [1]);

        assert.equal(error !== undefined, true);

    });

});
