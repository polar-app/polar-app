import {AsyncWorkQueue} from './AsyncWorkQueue';

export class AsyncWorkQueues {

    /**
     * Await a list of promises concurrently.
     *
     */
    public static async awaitPromises<T>(promises: ReadonlyArray<Promise<T>>,
                                         concurrency: number = 25): Promise<ReadonlyArray<T>> {

        const results: T[] = [];

        const work = promises.map(current => async () => {
            const value = await current;
            results.push(value);
        });

        const asyncWorkQueue = new AsyncWorkQueue(work, concurrency);

        await asyncWorkQueue.execute();

        return results;

    }

}
