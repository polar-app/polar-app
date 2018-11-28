import {IListenablePersistenceLayer} from '../IListenablePersistenceLayer';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {PersistenceLayerListener} from '../PersistenceLayerListener';
import {PersistenceLayer} from '../PersistenceLayer';
import {DocMeta} from '../../metadata/DocMeta';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {DeleteResult, DocMetaSnapshotEvent, FileRef,
        DocMetaSnapshotEventListener, SnapshotResult,
        ErrorListener,
    Datastore} from '../Datastore';
import {PersistenceEventType} from '../PersistenceEventType';
import {Backend} from '../Backend';
import {DatastoreFile} from '../DatastoreFile';
import {FileMeta} from '../Datastore';
import {Optional} from '../../util/ts/Optional';
import {DocInfo} from '../../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from '../DatastoreMutation';
import {NULL_FUNCTION} from '../../util/Functions';

export abstract class AbstractAdvertisingPersistenceLayer implements IListenablePersistenceLayer {

    public readonly datastore: Datastore;

    public readonly stashDir: string;

    public readonly logsDir: string;

    protected readonly reactor = new SimpleReactor<PersistenceLayerEvent>();

    /**
     * A PersistenceLayer for the non-dispatched methods (for now).
     */
    protected readonly delegate: PersistenceLayer;

    protected constructor(delegate: PersistenceLayer) {
        this.datastore = delegate.datastore;
        this.delegate = delegate;
        this.stashDir = this.delegate.stashDir;
        this.logsDir = this.delegate.logsDir;
    }

    public abstract init(): Promise<void>;

    public abstract stop(): Promise<void>;

    public addEventListener(listener: PersistenceLayerListener): void {
        this.reactor.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {

        this.addEventListener((event) => {

            if (fingerprint === event.docInfo.fingerprint) {
                listener(event);
            }

        });

    }

    public async writeDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo> {
        return await this.write(docMeta.docInfo.fingerprint, docMeta, datastoreMutation);
    }

    public async write(fingerprint: string,
                       docMeta: DocMeta,
                       datastoreMutation: DatastoreMutation<DocInfo> = new DefaultDatastoreMutation()): Promise<DocInfo> {

        const eventType: PersistenceEventType
            = this.contains(fingerprint) ? 'updated' : 'created';

        const docInfo = await this.delegate.write(fingerprint, docMeta, datastoreMutation);

        this.broadcastEvent({
            docInfo,
            docMetaRef: {
                fingerprint: docMeta.docInfo.fingerprint
            },
            eventType
        });

        return docInfo;

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.delegate.getDocMetaFiles();
    }

    public snapshot(listener: DocMetaSnapshotEventListener,
                    errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        return this.delegate.snapshot(listener, errorListener);

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

    public writeFile(backend: Backend, ref: FileRef, data: Buffer | string, meta: FileMeta): Promise<DatastoreFile> {
        return this.delegate.writeFile(backend, ref, data, meta);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.delegate.containsFile(backend, ref);
    }

    public getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {
        return this.delegate.getFile(backend, ref);
    }

    protected abstract broadcastEvent(event: PersistenceLayerEvent): void;

}

