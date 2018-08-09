/**
 * The status of a job as state transitions.
 *
 *                      +--> COMPLETED
 * PENDING --> STARTED--|
 *                      +--> FAILED
 */
export enum SyncStatus {

    PENDING = "PENDING",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"

}
