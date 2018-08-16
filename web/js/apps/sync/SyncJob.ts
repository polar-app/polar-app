/**
 * A job to perform a sync.  Jobs are started in running state and can be
 * aborted.
 */

export interface SyncJob {

}

/**
 * The job is pending but not yet started.
 */
export interface PendingSyncJob extends SyncJob {

    start(): StartedSyncJob;

}

/**
 * Abort a job that has been started.
 */
export interface StartedSyncJob extends SyncJob {

    abort(): void;

}
