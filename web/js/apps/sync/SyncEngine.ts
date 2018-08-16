/**
 * A SyncTarget provides a way to integrate with 3rd party sync implementations.
 */
import {DocMetaSet} from '../../metadata/DocMetaSet';
import {SyncProgressListener} from './SyncProgressListener';
import {SyncEngineDescriptor} from './SyncEngineDescriptor';
import {PendingSyncJob, SyncJob} from './SyncJob';

export interface SyncEngine {

    readonly descriptor: SyncEngineDescriptor;

    /**
     * Create a new sync against this engine. We receive callbacks on the
     * progress via the SyncProgressListener and the job can be aborted via the
     * SyncJob.  Note that the job is not initially started and start() must be
     * called manually.
     */
    sync(docMetas: DocMetaSet, progress: SyncProgressListener): PendingSyncJob;

}
