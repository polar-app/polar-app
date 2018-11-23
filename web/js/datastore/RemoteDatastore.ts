import {Datastore, DocMetaSnapshotEvent, FileMeta, FileRef, InitResult, DocMetaSnapshotEventListener} from './Datastore';
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

/**
 * A remote datastore bug one that has a native implementation of snapshot
 * so that it operates in the proper thread.
 */
export class RemoteDatastore extends DelegatedDatastore {

    constructor(delegate: Datastore) {
        super(delegate);
    }

    public async snapshot(listener: DocMetaSnapshotEventListener): Promise<void> {
        return Datastores.snapshot(this, listener);
    }

}
