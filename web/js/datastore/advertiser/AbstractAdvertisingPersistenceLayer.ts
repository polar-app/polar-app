import {IListenablePersistenceLayer} from '../IListenablePersistenceLayer';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {PersistenceLayerListener} from '../PersistenceLayerListener';
import {IPersistenceLayer} from '../IPersistenceLayer';
import {DocMeta} from '../../metadata/DocMeta';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {DeleteResult} from '../DiskDatastore';
import {PersistenceEventType} from '../PersistenceEventType';

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

    public abstract broadcastEvent(event: PersistenceLayerEvent): void;

    public addEventListener(listener: PersistenceLayerListener): void {
        this.reactor.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {

        this.addEventListener((event) => {

            if (fingerprint !== event.docInfo.fingerprint) {
                listener(event);
            }

        });

    }

    public async syncDocMeta(docMeta: DocMeta): Promise<void> {
        return await this.sync(docMeta.docInfo.fingerprint, docMeta);
    }

    public async sync(fingerprint: string, docMeta: DocMeta) {

        const result = this.persistenceLayer.sync(fingerprint, docMeta);

        let eventType: PersistenceEventType;

        if (this.contains(fingerprint)) {
            eventType = 'updated';
        } else {
            eventType = 'created';
        }

        this.broadcastEvent({
            docInfo: docMeta.docInfo,
            docMetaRef: {
                fingerprint: docMeta.docInfo.fingerprint
            },
            eventType
        });

        return result;

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

}

