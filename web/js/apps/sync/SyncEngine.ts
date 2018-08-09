/**
 * A SyncTarget provides a way to integrate with 3rd party sync implementations.
 */
import {DocMetaSet} from '../../metadata/DocMetaSet';
import {SyncProgressListener} from './SyncProgressListener';
import {SyncEngineDescriptor} from './SyncEngineDescriptor';
import {SyncJob} from './SyncJob';

export interface SyncEngine {

    readonly descriptor: SyncEngineDescriptor;

    /**
     * Start a sync against this engine. We receive callbacks on the progress
     * via the SyncProgressListener and the job can be aborted via the SyncJob.
     */
    sync(docMetas: DocMetaSet, progress: SyncProgressListener): SyncJob;

}
