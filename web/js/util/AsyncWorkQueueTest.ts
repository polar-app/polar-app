import {assert} from 'chai';
import {Progress} from './Progress';
import {ResolvablePromise} from './ResolvablePromise';
import {ParallelWorkQueue} from './ParallelWorkQueue';
import {assertJSON} from '../test/Assertions';
import {Latch} from './Latch';
import waitForExpect from 'wait-for-expect';
import {PolarDataDir} from '../test/PolarDataDir';
import {FilePaths} from './FilePaths';
import {Files} from './Files';
import {AsyncFunction, AsyncWorkQueue} from './AsyncWorkQueue';

interface Widget {

}

let mockValue: number = 0;

export async function mockAsyncFunction() {
    return mockValue++;
}

describe('AsyncWorkQueue', function() {

    let inputs: AsyncFunction[] = [];

    beforeEach(function() {
        mockValue = 0;
        inputs = [];
    });

    it("With no work", async function() {

        const work: AsyncFunction[] = [];

        const asyncWorkQueue = new AsyncWorkQueue(work);
        await asyncWorkQueue.execute();

        assertJSON(inputs.sort(), []);

    });

    it("With work smaller than concurrency.", async function() {
        const work: AsyncFunction[] = [mockAsyncFunction, mockAsyncFunction];
        const asyncWorkQueue = new AsyncWorkQueue(work, 10);
        await asyncWorkQueue.execute();
        assertJSON(work.sort(), []);
    });

    it("With work larger than concurrency.", async function() {
        const work: AsyncFunction[] = [mockAsyncFunction, mockAsyncFunction, mockAsyncFunction];
        const asyncWorkQueue = new AsyncWorkQueue(work, 2);
        await asyncWorkQueue.execute();
        assertJSON(work.sort(), []);
    });


    it("With verified concurrency", async function() {

        const latches: Array<Latch<boolean>> = [];

        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());
        latches.push(new Latch());

        let concurrency = 0;

        async function verifyConcurrency() {
            const latch = latches[concurrency++];
            await latch.get();
            return true;
        }

        const work = [verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency,
                      verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency, verifyConcurrency];

        const asyncWorkQueue = new AsyncWorkQueue(work, 10);
        await asyncWorkQueue.execute();

        await waitForExpect(async () => {
            assert.equal(concurrency, 10);
            assert.equal(asyncWorkQueue.getExecuting(), 10);
        });

        for (const latch of latches) {
            latch.resolve(true);
        }

    });

});

