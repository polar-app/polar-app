import {Datastore, DatastoreID, ErrorListener, InitResult} from './Datastore';
import {DocMetaRef} from './DocMetaRef';
import {DiskDatastore} from './DiskDatastore';
import {RemoteDatastore} from './RemoteDatastore';
import {Backend} from './Backend';
import {FileRef} from './Datastore';
import {BinaryFileData} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {DocFileMeta} from './DocFileMeta';
import {isBinaryFileData} from './Datastore';
import {Blobs} from '../util/Blobs';
import {Optional} from '../util/ts/Optional';
import {GetFileOpts} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocFileURLMeta} from './DocFileMeta';

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

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return await this.diskDatastore.getDocMetaRefs();
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return await this.diskDatastore.getDocMeta(fingerprint);
    }

}

/**
 * A simple cache so that we can immediately make the blob ref available locally
 * even though it has NOT been written to the datastore yet to avoid latency
 * when the data is already local. We might want to think about using the
 * browser caches API in the future instead of forcing this into memory but
 * honestly this should be impossible for a user to cause the browser to run
 * out of memory just with their annotations.
 */
export class DatastoreFileCache {

    // FIXME: we need the ability to flish this when an image is removed when
    //  it's updated.

    private static readonly backing: {[key: string]: DocFileMeta} = {};

    public static writeFile(backend: Backend, ref: FileRef, meta: DocFileURLMeta) {
        const key = this.toKey(backend, ref);
        this.backing[key] = {...meta, backend, ref};
    }

    public static getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): Optional<DocFileMeta> {
        const key = this.toKey(backend, ref);
        const entry = this.backing[key];
        return Optional.of(entry);
    }

    private static toKey(backend: Backend, ref: FileRef) {
        return `${backend}:${ref.name}`;
    }

}
