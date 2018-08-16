/**
 * A queue that supports adding tasks and executing/draining draining all tasks.
 *
 * The queue can be expanded by adding more tasks.  Generally the idea is that
 * the user performs various steps and between each step it drains the queue by
 * executing all tasks.
 */
import {SyncProgressListener} from './SyncProgressListener';
import {Abortable} from './Abortable';
import {SyncProgress} from './SyncProgress';
import {SyncState} from './SyncState';
import {Progress} from '../../util/Progress';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class SyncQueue {

    private readonly pending: SyncTask[] = [];

    /**
     * The total number of tasks that have been submitted.
     */
    private total = 0;

    private readonly abortable: Abortable;

    private readonly syncProgressListener: SyncProgressListener;

    constructor(abortable: Abortable, syncProgressListener: SyncProgressListener) {
        this.abortable = abortable;
        this.syncProgressListener = syncProgressListener;
    }

    /**
     * Add tasks that need executing.
     */
    add(...task: SyncTask[]) {
        this.pending.push(...task);
        ++this.total;
    }

    /**
     * Execute all tasks in the queue.
     */
    async execute() {

        let syncProgress: SyncProgress = {
            percentage: 0,
            state: SyncState.STARTED,
            error: undefined
        };

        let progress = new Progress(this.total + this.pending.length, this.total);

        for (let idx = 0; idx < this.pending.length; idx++) {

            const syncTask = this.pending.pop()!;

            if(this.abortable.aborted) {
                log.info("Aborting sync.");
                return;
            }

            try {

                await syncTask();

            } catch (e) {

                syncProgress.error = e;
                syncProgress.state = SyncState.FAILED;

                this.syncProgressListener(Object.freeze(syncProgress));

                break;
            }

            progress.incr();

            syncProgress.percentage = progress.percentage();

            this.syncProgressListener(Object.freeze(syncProgress));

        }


    }

    size() {
        return this.pending.length;
    }

}
