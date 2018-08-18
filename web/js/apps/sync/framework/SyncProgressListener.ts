import {SyncProgress} from './SyncProgress';


/**
 * Allows a SyncTarget to expose its progress.
 */
export interface SyncProgressListener {

    (syncProgress: Readonly<SyncProgress>): void;

}
