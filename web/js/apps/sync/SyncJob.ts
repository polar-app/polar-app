/**
 * A job to perform a sync.  Jobs are started in running state and can be
 * aborted.
 */
export interface SyncJob {

    abort(): void;

}
