import {
    AbstractDatastore,
    Datastore,
    DatastoreCapabilities,
    DatastoreID,
    DatastoreOverview,
    DeleteResult,
    DocMetaSnapshotEventListener,
    DocMetaSnapshotOpts,
    DocMetaSnapshotResult,
    InitResult,
    SnapshotResult,
} from './Datastore';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DatastoreMutation} from 'polar-shared/src/datastore/DatastoreMutation';
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";
import {FirebaseDatastores} from "polar-shared-datastore/src/FirebaseDatastores";
import WriteOpts = FirebaseDatastores.WriteOpts;
import BinaryFileData = FirebaseDatastores.BinaryFileData;
import WriteFileOpts = FirebaseDatastores.WriteFileOpts;

/**
 * A datastore that just forwards events to the given delegate.
 */
export class DelegatedDatastore extends AbstractDatastore implements Datastore {

    public readonly id: DatastoreID;

    protected readonly delegate: Datastore;

    constructor(delegate: Datastore) {
        super();
        Preconditions.assertPresent(delegate, 'delegate');
        this.id = 'delegated:' + delegate.id;
        this.delegate = delegate;

    }

    public contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>> {
        return this.delegate.delete(docMetaFileRef, datastoreMutation);
    }

    public writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        return this.delegate.writeFile(backend, ref, data, opts);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.delegate.containsFile(backend, ref);
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        return this.delegate.getFile(backend, ref, opts);
    }

    public deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        return this.delegate.deleteFile(backend, ref);
    }

    public getDocMeta(fingerprint: string): Promise<string | null> {
        return this.delegate.getDocMeta(fingerprint);
    }

    public async getDocMetaSnapshot(opts: DocMetaSnapshotOpts<string>): Promise<DocMetaSnapshotResult> {
        return this.delegate.getDocMetaSnapshot(opts);
    }

    public getDocMetaRefs(): Promise<ReadonlyArray<DocMetaRef>> {
        return this.delegate.getDocMetaRefs();
    }

    public async snapshot(listener: DocMetaSnapshotEventListener): Promise<SnapshotResult> {
        return this.delegate.snapshot(listener);
    }

    public async createBackup(): Promise<void> {
        return this.delegate.createBackup();
    }

    public init(): Promise<InitResult> {
        return this.delegate.init();
    }

    public stop(): Promise<void> {
        return this.delegate.stop();
    }

    public write(fingerprint: string, data: any, docInfo: IDocInfo, opts?: WriteOpts): Promise<void> {
        return this.delegate.write(fingerprint, data, docInfo, opts);
    }

    public async synchronizeDocs(...docMetaRefs: ReadonlyArray<DocMetaRef>): Promise<void> {
        return this.delegate.synchronizeDocs(...docMetaRefs);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.delegate.overview();
    }

    public capabilities(): DatastoreCapabilities {
        return this.delegate.capabilities();
    }

}

