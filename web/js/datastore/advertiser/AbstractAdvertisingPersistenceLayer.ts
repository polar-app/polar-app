import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {PersistenceLayerListener} from '../PersistenceLayerListener';
import {PersistenceLayer, PersistenceLayerID} from '../PersistenceLayer';
import {DocMeta} from '../../metadata/DocMeta';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {
    DeleteResult, DocMetaSnapshotEvent, FileRef,
    DocMetaSnapshotEventListener, SnapshotResult,
    ErrorListener,
    Datastore, BinaryFileData
} from '../Datastore';
import {PersistenceEventType} from '../PersistenceEventType';
import {Backend} from '../Backend';
import {DatastoreFile} from '../DatastoreFile';
import {FileMeta} from '../Datastore';
import {Optional} from '../../util/ts/Optional';
import {DocInfo} from '../../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from '../DatastoreMutation';
import {NULL_FUNCTION} from '../../util/Functions';
import {Logger} from '../../logger/Logger';
import {Releaseable} from '../../reactor/EventListener';

const log = Logger.create();

export abstract class AbstractAdvertisingPersistenceLayer implements ListenablePersistenceLayer {

    public abstract readonly id: PersistenceLayerID;

    public readonly datastore: Datastore;

    protected readonly reactor = new SimpleReactor<PersistenceLayerEvent>();

    /**
     * A PersistenceLayer for the non-dispatched methods (for now).
     */
    public readonly delegate: PersistenceLayer;

    protected constructor(delegate: PersistenceLayer) {
        this.datastore = delegate.datastore;
        this.delegate = delegate;
    }

    public init(errorListener?: ErrorListener): Promise<void> {
        return this.delegate.init(errorListener);
    }

    public stop(): Promise<void> {
        return this.delegate.stop();
    }

    public addEventListener(listener: PersistenceLayerListener): Releaseable {
        return this.reactor.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {

        this.addEventListener((event) => {

            if (fingerprint === event.docInfo.fingerprint) {
                listener(event);
            }

        });

    }

    public async writeDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo> {

        return await this.handleWrite(docMeta, async () => await this.delegate.writeDocMeta(docMeta, datastoreMutation));

    }

    public async write(fingerprint: string,
                       docMeta: DocMeta,
                       datastoreMutation: DatastoreMutation<DocInfo> = new DefaultDatastoreMutation()): Promise<DocInfo> {

        return await this.handleWrite(docMeta, async () => await this.delegate.write(fingerprint, docMeta, datastoreMutation));

    }

    private async handleWrite(docMeta: DocMeta, handler: () => Promise<DocInfo>) {

        const docInfo = await handler();

        const eventType: PersistenceEventType
            = this.contains(docMeta.docInfo.fingerprint) ? 'updated' : 'created';

        this.broadcastEvent({
            docInfo,
            docMetaRef: {
                fingerprint: docMeta.docInfo.fingerprint
            },
            eventType
        });

        return docInfo;

    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return this.delegate.synchronizeDocs(...docMetaRefs);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.delegate.getDocMetaRefs();
    }

    public snapshot(listener: DocMetaSnapshotEventListener,
                    errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        return this.delegate.snapshot(listener, errorListener);

    }

    public async createBackup(): Promise<void> {
        return this.delegate.createBackup();
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<DeleteResult> {

        const result = this.delegate.delete(docMetaFileRef);

        this.broadcastEvent({
            docInfo: docMetaFileRef.docInfo,
            docMetaRef: {
                fingerprint: docMetaFileRef.fingerprint
            },
            eventType: 'deleted'
        });

        return result;
    }

    public async getDocMeta(fingerprint: string): Promise<DocMeta | undefined> {
        return await this.delegate.getDocMeta(fingerprint);
    }

    /**
     * Dispatch an event to all listeners. This is different from notify in that
     * this just dispatches to the local reactor.
     */
    public dispatchEvent(event: PersistenceLayerEvent) {
        this.reactor.dispatchEvent(event);
    }

    public writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, meta: FileMeta): Promise<DatastoreFile> {
        return this.delegate.writeFile(backend, ref, data, meta);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.delegate.containsFile(backend, ref);
    }

    public getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {
        return this.delegate.getFile(backend, ref);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    protected abstract broadcastEvent(event: PersistenceLayerEvent): void;

    public async deactivate() {
        await this.delegate.deactivate();
    }

}

