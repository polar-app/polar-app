/**
 * Keeps track of the overall sync state and allows for state transitions
 * including the ability to abort a sync.
 *
 */
import {SyncStatus} from './SyncStatus';

export class SyncState {

    /**
     * The completion percentage over the interval [0,100]
     */
    public readonly progress: number | undefined;

    public readonly status = SyncStatus.PENDING;

    /**
     * The error for the sync when the status is failed.
     */
    public readonly error: Error | undefined;

    /**
     * A message to display to the user.  Probably the last annotation and/or
     * document synchronized.
     */
    public readonly message: string = "";

}
