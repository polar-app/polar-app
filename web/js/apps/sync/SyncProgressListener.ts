import {SyncState} from './SyncState';


/**
 * Allows a SyncTarget to expose its progress.
 */
export interface SyncProgressListener {

    (state: SyncState): void;

}
