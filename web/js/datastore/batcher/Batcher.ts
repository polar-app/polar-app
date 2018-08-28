/**
 * Smart batching system which accepts work and only executes once very T ms or
 * every N batch items.
 *
 * This is used to prevent duplicate writes in a chain from the event store and
 * only write the first and the last. It doesn't make sense to write
 * intermediate writes because we're going to eventually write he last.
 *
 * https://mechanical-sympathy.blogspot.com/2011/10/smart-batching.html
 */
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class Batcher {

    private readonly runnable: AsyncRunnable;

    private tickets: boolean[] = [];

    constructor(runnable: AsyncRunnable) {
        this.runnable = runnable;
    }

    public async execute(): Promise<Execution> {

        if (this.tickets.length > 0) {

            // Push a ticket on so that the worker thread handling this IO
            // can complete my work for me when it finishes the next write.

            // Note that the count of tickets is unbounded and if this system
            // goes too fast we might use excessive memory.  I'm not sure if
            // there is a way to get around this in Javascript as I need to
            // lock around a variable and I don't think I can do that.

            // NOTE: the excess entry isn't going to change anything.. it's just
            // going to mean that we don't know how many we deleted/injected.

            // NOTE: there's another strategy that we could pursue. We could
            // stick ONE entry into the queue and then that would be an object
            // with a count of the pending /batched items.  The only issue there
            // is that the accounting could be inaccurate as we have a race
            // between the reader and a writer.  In practice I don't think this
            // would run out of memory so this is probably an acceptable
            // strategy.

            let pending = this.tickets.length;

            this.tickets.push(true);

            return <DelayedExecution>{pending}

        }

        let batched = 0;

        let batches = 0;

        let ticketsPerBatch: number[] = [];

        // keep writing while we have tickets. The other tickets are when people
        // have been writing while we were blocked.
        while (this.tickets.length > 0) {
            let nrTickets = this.tickets.length;
            log.debug("Executing request for N tickets: ", nrTickets);
            this.tickets.splice(0, nrTickets);

            ticketsPerBatch.push(nrTickets);
            batched += nrTickets;

            await this.runnable();
            ++batches;
        }

        return <HandledExecution>{ batched, batches, ticketsPerBatch };

    }

}

export interface Execution {

}

/**
 * Metadata around the a delayed execution.  IE no work was completed but instead
 * scheduled.
 */
export interface DelayedExecution {

    /**
     * The number of tickets in the queue at the time this was executed.
     */
    readonly pending: number;

}

/**
 * Metdata around the last execution of this batch. Mostly for testing purposes.
 */
export interface HandledExecution extends Execution {

    /**
     * The total number of batched records written across all batches.
     */
    readonly batched: number;

    /**
     * The total number of batches executed in the last call to execute()
     */
    readonly batches: number;

    /**
     * For each batch, the number of tickets executed within that batch.
     */
    readonly ticketsPerBatch: number[];

}

/**
 * Interface that just returns a promise and performs work. The results are not
 * needed other than to make sure we execute.
 */
export interface AsyncRunnable {
    (): Promise<void>;
}

/**
 * Async runnable that performs no operation.
 */
export async function nullAsyncRunnable() {

}
