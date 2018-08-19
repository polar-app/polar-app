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
import {SyncTask, SyncTaskResult} from './SyncTask';
import {Logger} from '../../../logger/Logger';
import {Percentages} from '../../../util/Percentages';
import {Optional} from '../../../util/ts/Optional';

const log = Logger.create();

export class SyncQueue {

    private readonly pending: SyncTask[] = [];

    /**
     * The total number of tasks that have been submitted.
     */
    private total = 0;

    private readonly abortable: Abortable;

    private readonly syncProgressListener: SyncProgressListener;

    /**
     *
     * @param abortable The abortable service running the sync. When aborted is
     * true we need to stop the sync.
     *
     * @param syncProgressListener A callback for the state while we're
     *     executing.
     */
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
            error: undefined,
            taskResult: Optional.empty()
        };

        let syncTask: SyncTask | undefined;

        let idx = 0;

        while((syncTask = this.pending.shift()) !== undefined) {

            if(this.abortable.aborted) {
                log.info("Aborting sync.");
                return;
            }

            try {

                syncProgress.taskResult = await syncTask();

            } catch (e) {

                syncProgress.error = e;
                syncProgress.state = SyncState.FAILED;

                this.syncProgressListener(Object.freeze(Object.assign({}, syncProgress)));

                break;
            }

            ++idx;
            syncProgress.percentage = Percentages.calculate(idx, this.total);

            this.syncProgressListener(Object.freeze(Object.assign({}, syncProgress)));


        }

    }

    size() {
        return this.pending.length;
    }

}
