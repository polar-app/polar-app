import {SyncProgress} from './SyncProgress';


/**
 * Allows a SyncTarget to expose its progress.
 */
export interface SyncProgressListener {

    (state: SyncProgress): void;

}
