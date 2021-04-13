/**
 * The status of a job as state transitions.
 *
 *                      +--> COMPLETED
 * PENDING --> STARTED--|
 *                      +--> FAILED
 */
export enum SyncState {

    /**
     * The job has not yet started and is still pending.
     */
    PENDING = "PENDING",

    /**
     * The job has started.
     */
    STARTED = "STARTED",

    COMPLETED = "COMPLETED",

    /**
     * Failed with an error.
     */
    FAILED = "FAILED",

    /**
     * Aborted by the user.
     */
    ABORTED = "ABORTED"

}
