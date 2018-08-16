/**
 */
import {SyncProgressListener} from './SyncProgressListener';
import {Abortable} from './Abortable';
import {SyncProgress} from './SyncProgress';
import {SyncState} from './SyncState';
import {Progress} from '../../util/Progress';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class SyncRunner {

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

    async execute(...syncTasks: SyncTask[]) {

        if(syncTasks.length === 0) {
            return;
        }

        let syncProgress: SyncProgress = {
            percentage: 0,
            state: SyncState.STARTED,
            error: undefined
        };

        let progress = new Progress(this.total + syncTasks.length, this.total);

        let len = syncTasks.length;

        for (let idx = 0; idx < len; idx++) {

            const syncTask = syncTasks.pop()!;

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

}
