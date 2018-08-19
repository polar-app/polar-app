/**
 * A job to perform a sync.  Jobs are started in running state and can be
 * aborted.
 */
import {Abortable} from './Abortable';

export interface SyncJob {

}

/**
 * The job is pending but not yet started.
 */
export interface PendingSyncJob extends SyncJob {

    start(): Promise<StartedSyncJob>;

}

/**
 * Abort a job that has been started.
 */
export interface StartedSyncJob extends SyncJob, Abortable{

    abort(): void;

}
