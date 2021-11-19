import {Datastore} from './Datastore';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {DatastoreFileCache} from './DatastoreFileCache';
import {DelegatedDatastore} from './DelegatedDatastore';
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";


/**
 * Basic delegated datastore so that we can resolve files form the local file
 * cache before going to the network version.
 */
export class DataFileCacheDatastore extends DelegatedDatastore {

    constructor(delegate: Datastore) {
        super(delegate);
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {

        const hit = DatastoreFileCache.getFile(backend, ref);

        if (hit.isPresent()) {
            console.debug("Found file in datastore cache: ", {backend, ref});
            return hit.get();
        }

        return super.getFile(backend, ref, opts);

    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        DatastoreFileCache.evictFile(backend, ref);
        return super.deleteFile(backend, ref);
    }

}

