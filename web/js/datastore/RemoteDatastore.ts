import {Datastore, DocMetaSnapshotEvent, FileMeta, FileRef, InitResult, DocMetaSnapshotEventListener, SnapshotResult, ErrorListener, DatastoreID} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {IDocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {Datastores} from './Datastores';
import {DelegatedDatastore} from './DelegatedDatastore';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {Logger} from '../logger/Logger';

const log = Logger.create();

/**
 * A remote datastore bug one that has a native implementation of snapshot
 * so that it operates in the proper thread.
 */
export class RemoteDatastore extends DelegatedDatastore {

    private readonly docMetaSnapshotEventDispatcher: IEventDispatcher<DocMetaSnapshotEvent> = new SimpleReactor();

    public readonly id: DatastoreID;

    constructor(delegate: Datastore) {
        super(delegate);
        this.id = 'remote:' + delegate.id;
    }

    public async snapshot(listener: DocMetaSnapshotEventListener): Promise<SnapshotResult> {
        return Datastores.createCommittedSnapshot(this, listener);
    }

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    public async init(errorListener?: ErrorListener): Promise<InitResult> {

        if (this.docMetaSnapshotEventDispatcher.size() > 0) {

            // perform a snapshot if a listener was attached...
            this.snapshot(async event => this.docMetaSnapshotEventDispatcher.dispatchEvent(event))
                .catch(err => log.error(err));

        }

        return {};
    }

    /**
     * An event listener to listen to the datastore while operating on both
     * the underlying datastores to discover when documents are discovered
     * without having to re-read the datastore after it's been initialized.
     */
    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }

}
