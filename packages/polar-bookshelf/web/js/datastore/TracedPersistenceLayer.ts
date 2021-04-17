import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';
import {PersistenceLayerListener} from './PersistenceLayerListener';
import {
    BinaryFileData,
    Datastore,
    DatastoreCapabilities,
    DatastoreInitOpts,
    DatastoreOverview,
    DeleteResult,
    DocMetaSnapshotEventListener, DocMetaSnapshotOpts, DocMetaSnapshotResult,
    ErrorListener,
    SnapshotResult,
    WriteFileOpts
} from './Datastore';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DatastoreMutation} from './DatastoreMutation';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {WriteOpts} from './PersistenceLayer';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {UserTagsDB} from "./UserTagsDB";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";

const tracer = RendererAnalytics.createTracer('persistence-layer');

/**
 * A PersistenceLayer that traces potentially slow operations so we can
 * analyze performance at runtime and try to keep optimizing the high level
 * operations.
 * @NotStale
 */
export class TracedPersistenceLayer implements ListenablePersistenceLayer {

    public readonly datastore: Datastore;

    constructor(private readonly delegate: ListenablePersistenceLayer,
                public readonly id: string = 'traced') {
        this.datastore = delegate.datastore;
    }

    public addEventListener(listener: PersistenceLayerListener) {
        return this.delegate.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {
        this.delegate.addEventListenerForDoc(fingerprint, listener);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return tracer.traceAsync('contains', () => this.delegate.contains(fingerprint));
    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return tracer.traceAsync('containsFile', () => this.delegate.containsFile(backend, ref));
    }

    public deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        return tracer.traceAsync('deleteFile', () => this.datastore.deleteFile(backend, ref));
    }

    public async deactivate(): Promise<void> {
        return this.delegate.deactivate();
    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult> {
        return tracer.traceAsync('delete', () => this.delegate.delete(docMetaFileRef, datastoreMutation));
    }

    public async getDocMeta(fingerprint: string): Promise<IDocMeta| undefined> {
        return tracer.traceAsync('getDocMeta', () => this.delegate.getDocMeta(fingerprint));
    }

    public async getDocMetaSnapshot(opts: DocMetaSnapshotOpts<IDocMeta>): Promise<DocMetaSnapshotResult> {
        return tracer.traceAsync('getDocMetaSnapshot', () => this.delegate.getDocMetaSnapshot(opts));
    }

    public async getDocMetaRefs(): Promise<ReadonlyArray<DocMetaRef>> {
        return tracer.traceAsync('getDocMetaRefs', () => this.delegate.getDocMetaRefs());
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {
        return tracer.trace('getFile', () => this.delegate.getFile(backend, ref, opts));
    }

    public async init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<void> {
        return this.delegate.init(errorListener, opts);
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

    public async write(fingerprint: string, docMeta: IDocMeta, opts?: WriteOpts): Promise<IDocInfo> {
        return tracer.traceAsync('write', () => this.delegate.write(fingerprint, docMeta, opts));
    }

    public async writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo> {
        return tracer.traceAsync('writeDocMeta', () => this.delegate.writeDocMeta(docMeta, datastoreMutation));
    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return tracer.traceAsync('synchronizeDocs', () => this.delegate.synchronizeDocs(...docMetaRefs));
    }

    public async writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        return tracer.traceAsync('writeFile', () => this.delegate.writeFile(backend, ref, data, opts));
    }

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.delegate.overview();
    }

    public capabilities(): DatastoreCapabilities {
        return this.delegate.capabilities();
    }

}
