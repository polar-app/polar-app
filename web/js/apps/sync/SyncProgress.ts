/**
 * Keeps track of the overall sync state and allows for state transitions
 * including the ability to abort a sync.
 *
 */
import {SyncState} from './SyncState';

export class SyncProgress {

    /**
     * The completion percentage over the interval [0,100]
     */
    public readonly percentage: number | undefined;

    public readonly state = SyncState.PENDING;

    /**
     * The error for the sync when the status is failed.
     */
    public readonly error: Error | undefined;

    // TODO: not sure if we should expose this.
    //
    // /**
    //  * A message to display to the user.  Probably the last annotation and/or
    //  * document synchronized.
    //  */
    // public readonly message: string = "";

    constructor(percentage: number | undefined, state: SyncState.PENDING, error: Error | undefined) {
        this.percentage = percentage;
        this.state = state;
        this.error = error;
    }

}
