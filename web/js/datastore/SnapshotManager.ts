import {Datastore, DatastoreConsistency, DatastoreID, DocMetaMutation, DocMetaSnapshotBatch, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, ErrorListener, SnapshotProgress, SnapshotResult, SynchronizationEvent} from "./Datastore";
import {Directories} from './Directories';
import {DocMetaFileRef} from './DocMetaRef';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DiskDeleteResult} from './DiskDatastore';
import {NULL_FUNCTION} from '../util/Functions';
import {Datastores} from './Datastores';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {ProgressTrackers} from "../util/ProgressTrackers";

/**
 */
export class SnapshotManager {

    private readonly synchronizationEventDispatcher: IEventDispatcher<SynchronizationEvent> = new SimpleReactor();

    private readonly datastore: Datastore;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    public onDelete(docMetaFileRef: DocMetaFileRef): void {

        const docMetaSnapshotEvent: DocMetaSnapshotEvent = {

            datastore: this.datastore.id,
            progress: ProgressTrackers.completed(),
            consistency: 'committed',
            docMetaMutations: [
                {
                    fingerprint: docMetaFileRef.fingerprint,
                    // for deletes do not reference the DocInfo or the DocMeta
                    docMetaProvider: async () => null!,
                    docInfoProvider: async () => null!,
                    docMetaFileRefProvider: async () => docMetaFileRef,
                    mutationType: 'deleted'
                }

            ],

        };

    }

    public onSnapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener) {
        this.synchronizationEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }

}
