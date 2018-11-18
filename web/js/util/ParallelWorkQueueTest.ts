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

interface Widget {

}


describe('ParallelWorkQueue', function() {

    let inputs: string[] = [];

    async function dataReader(data: string): Promise<Widget> {
        inputs.push(data);
        return {};
    }

    beforeEach(function() {
        inputs = [];
    });

    it("With no work", async function() {
        const parallelWorkQueue = new ParallelWorkQueue([], dataReader);
        await parallelWorkQueue.execute();

        assertJSON(inputs.sort(), []);

    });

    it("With work smaller than execution size.", async function() {
        const parallelWorkQueue = new ParallelWorkQueue(["1", "2"], dataReader);
        await parallelWorkQueue.execute();
        assertJSON(inputs.sort(), ["1", "2"]);
    });

    it("With work larger than execution size.", async function() {
        const parallelWorkQueue = new ParallelWorkQueue(["1", "2", "3"], dataReader);
        await parallelWorkQueue.execute(2);
        assertJSON(inputs.sort(), ["1", "2", "3"]);
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

        async function verifyConcurrency(latch: Latch<boolean>) {
            ++concurrency;
            await latch.get();
            return true;
        }

        const parallelWorkQueue = new ParallelWorkQueue(latches, verifyConcurrency);
        await parallelWorkQueue.execute(10);

        await waitForExpect(async () => {
            assert.equal(concurrency, 10);
        });

        for (const latch of latches) {
            latch.resolve(true);
        }

    });

});

