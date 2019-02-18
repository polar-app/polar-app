import {
    Datastore, DocMetaSnapshotEvent, FileMeta, FileRef, InitResult,
    DocMetaSnapshotEventListener, SnapshotResult, DatastoreID,
    AbstractDatastore,
    ErrorListener, BinaryFileData
} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {IDocInfo, DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {Datastores} from './Datastores';
import {PersistenceLayers} from './PersistenceLayers';
import {PersistenceLayer, PersistenceLayerID} from './PersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {FileHandle} from '../util/Files';

/**
 * A PersistenceLayer that just forwards events to the given delegate.
 */
export class DelegatedPersistenceLayer implements PersistenceLayer {

    public readonly id: PersistenceLayerID = 'delegated';

    public readonly datastore: Datastore;

    private readonly delegate: PersistenceLayer;

    constructor(delegate: PersistenceLayer) {
        this.delegate = delegate;
        this.datastore = delegate.datastore;
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.delegate.containsFile(backend, ref);
    }

    public async deactivate(): Promise<void> {
        return this.delegate.deactivate();
    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult> {
        return this.delegate.delete(docMetaFileRef, datastoreMutation);
    }

    public async getDocMeta(fingerprint: string): Promise<DocMeta | undefined> {
        return this.delegate.getDocMeta(fingerprint);
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.delegate.getDocMetaRefs();
    }

    public async getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {
        return this.delegate.getFile(backend, ref);
    }

    public async init(errorListener?: ErrorListener): Promise<void> {
        return this.delegate.init();
    }

    public async snapshot(listener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult> {
        return this.delegate.snapshot(listener, errorListener);
    }

    public async createBackup(): Promise<void> {
        return this.delegate.createBackup();
    }

    public async stop(): Promise<void> {
        return this.delegate.stop();
    }

    public async write(fingerprint: string, docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo> {
        return this.delegate.write(fingerprint, docMeta, datastoreMutation);
    }

    public async writeDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo> {
        return this.delegate.writeDocMeta(docMeta, datastoreMutation);
    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return this.delegate.synchronizeDocs(...docMetaRefs);
    }

    public async writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, meta?: FileMeta): Promise<DatastoreFile> {
        return this.delegate.writeFile(backend, ref, data, meta);
    }

}
