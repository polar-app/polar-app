import {Datastore, DatastoreID, ErrorListener, InitResult} from './Datastore';
import {FileRef} from './Datastore';
import {BinaryFileData} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {isBinaryFileData} from './Datastore';
import {GetFileOpts} from './Datastore';
import {DocMetaRef} from './DocMetaRef';
import {DiskDatastore} from './DiskDatastore';
import {RemoteDatastore} from './RemoteDatastore';
import {Backend} from './Backend';
import {DocFileMeta} from './DocFileMeta';
import {Blobs} from '../util/Blobs';
import {Optional} from '../util/ts/Optional';
import {Logger} from '../logger/Logger';
import {DatastoreFileCache} from './DatastoreFileCache';

const log = Logger.create();

/**
 * A datastore which extends RemoteDatastore but adds support for local disk
 * operations for reads which are MUCH MUCH faster since we're not going through
 * IPC.  IPC is insanely slow.
 */
export class HybridRemoteDatastore extends RemoteDatastore {

    public readonly id: DatastoreID;

    private readonly diskDatastore: DiskDatastore;

    constructor(delegate: Datastore) {
        super(delegate);
        this.id = 'hybrid-remote:' + delegate.id;
        this.diskDatastore = new DiskDatastore();
    }

    public async init(errorListener?: ErrorListener): Promise<InitResult> {
        await super.init();
        await this.diskDatastore.init(errorListener);
        return {};
    }

    // FIXME: move to using : DataFileCacheDatastore
    public async getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): Promise<Optional<DocFileMeta>> {

        const hit = DatastoreFileCache.getFile(backend, ref);

        if (hit.isPresent()) {
            log.debug("Found file in datastore cache: ", {backend, ref});
            return hit;
        }

        return super.getFile(backend, ref, opts);

    }

    public writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {

        if ( !isBinaryFileData(data)) {
            throw new Error("Data is not BinaryFileData");
        }

        const toDiskData = (): BinaryFileData | NodeJS.ReadableStream => {

            if (data instanceof Blob) {
                return Blobs.toStream(data);
            } else {
                return data;
            }

        };

        const diskData = toDiskData();

        return this.diskDatastore.writeFile(backend, ref, diskData, opts);

    }


    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        DatastoreFileCache.evictFile(backend, ref);
        return super.deleteFile(backend, ref);
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return await this.diskDatastore.getDocMetaRefs();
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return await this.diskDatastore.getDocMeta(fingerprint);
    }

}

