import {IListenablePersistenceLayer} from '../IListenablePersistenceLayer';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {PersistenceLayerListener} from '../PersistenceLayerListener';
import {IPersistenceLayer} from '../IPersistenceLayer';
import {DocMeta} from '../../metadata/DocMeta';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {DeleteResult} from '../Datastore';
import {PersistenceEventType} from '../PersistenceEventType';
import {Backend} from '../Backend';
import {DatastoreFile} from '../DatastoreFile';
import {FileMeta} from '../Datastore';
import {Optional} from '../../util/ts/Optional';
import {DocInfo} from '../../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from '../DatastoreMutation';

export abstract class AbstractAdvertisingPersistenceLayer implements IListenablePersistenceLayer {

    public readonly stashDir: string;

    public readonly logsDir: string;

    protected readonly reactor = new SimpleReactor<PersistenceLayerEvent>();

    /**
     * A PersistenceLayer for the non-dispatched methods (for now).
     */
    protected readonly persistenceLayer: IPersistenceLayer;

    protected constructor(persistenceLayer: IPersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
        this.stashDir = this.persistenceLayer.stashDir;
        this.logsDir = this.persistenceLayer.logsDir;
    }

    public abstract init(): Promise<void>;

    public abstract stop(): Promise<void>;

    public abstract broadcastEvent(event: PersistenceLayerEvent): void;

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

    public async syncDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo> {
        return await this.sync(docMeta.docInfo.fingerprint, docMeta, datastoreMutation);
    }

    public async sync(fingerprint: string,
                      docMeta: DocMeta,
                      datastoreMutation: DatastoreMutation<DocInfo> = new DefaultDatastoreMutation()): Promise<DocInfo> {

        const eventType: PersistenceEventType
            = this.contains(fingerprint) ? 'updated' : 'created';

        const docInfo = await this.persistenceLayer.sync(fingerprint, docMeta, datastoreMutation);

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
        return this.persistenceLayer.contains(fingerprint);
    }

    public getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.persistenceLayer.getDocMetaFiles();
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<DeleteResult> {

        const result = this.persistenceLayer.delete(docMetaFileRef);

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
        return await this.persistenceLayer.getDocMeta(fingerprint);
    }

    /**
     * Dispatch an event to all listeners. This is different from notify in that
     * this just dispatches to the local reactor.
     * @param event
     */
    public dispatchEvent(event: PersistenceLayerEvent) {
        this.reactor.dispatchEvent(event);
    }

    public addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta): Promise<DatastoreFile> {
        return this.persistenceLayer.addFile(backend, name, data, meta);
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        return this.persistenceLayer.containsFile(backend, name);
    }

    public getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        return this.persistenceLayer.getFile(backend, name);
    }

}

