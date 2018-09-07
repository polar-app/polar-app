import {IListenablePersistenceLayer, IPersistenceLayer, PersistenceLayerEvent, PersistenceLayerListener} from '../PersistenceLayer';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {DocMeta} from '../../metadata/DocMeta';
import {AdvertisementType, DocInfoAdvertisement} from './DocInfoAdvertisement';
import {DocInfoAdvertiser} from './DocInfoAdvertiser';
import {DeleteResult} from '../DiskDatastore';
import {DocInfoAdvertisementListenerService} from './DocInfoAdvertisementListenerService';
import {SimpleReactor} from '../../reactor/SimpleReactor';

/**
 * A PersistenceLayer that allows the user to receive advertisements regarding
 * updates to the internal data.
 */
export class AdvertisingPersistenceLayer implements IListenablePersistenceLayer {

    public readonly stashDir: string;

    public readonly logsDir: string;

    /**
     * A PersistenceLayer for the non-dispatched methods (for now).
     */
    private readonly persistenceLayer: IPersistenceLayer;

    private readonly reactor = new SimpleReactor<PersistenceLayerEvent>();

    private readonly docInfoAdvertisementListenerService = new DocInfoAdvertisementListenerService();

    constructor(persistenceLayer: IPersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
        this.stashDir = this.persistenceLayer.stashDir;
        this.logsDir = this.persistenceLayer.logsDir;
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.persistenceLayer.contains(fingerprint);
    }

    public getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.persistenceLayer.getDocMetaFiles();
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<DeleteResult> {
        const result = this.persistenceLayer.delete(docMetaFileRef);

        DocInfoAdvertiser.send({docInfo: docMetaFileRef.docInfo, advertisementType: 'deleted'});

        return result;
    }

    public async getDocMeta(fingerprint: string): Promise<DocMeta | undefined> {
        return await this.persistenceLayer.getDocMeta(fingerprint);
    }

    public async init(): Promise<void> {

        this.docInfoAdvertisementListenerService
            .addEventListener((adv) => this.onDocInfoAdvertisement(adv));

        this.docInfoAdvertisementListenerService.start();
        return this.persistenceLayer.init();

    }

    public async syncDocMeta(docMeta: DocMeta): Promise<void> {
        return await this.sync(docMeta.docInfo.fingerprint, docMeta);
    }

    public async sync(fingerprint: string, docMeta: DocMeta) {

        const result = this.persistenceLayer.sync(fingerprint, docMeta);

        let advertisementType: AdvertisementType;

        if (this.contains(fingerprint)) {
            advertisementType = 'updated';
        } else {
            advertisementType = 'created';
        }

        DocInfoAdvertiser.send({docInfo: docMeta.docInfo, advertisementType});

        return result;

    }

    public addEventListener(listener: PersistenceLayerListener): void {
        this.reactor.addEventListener(listener);
    }

    private onDocInfoAdvertisement(docInfoAdvertisement: DocInfoAdvertisement) {

        this.reactor.dispatchEvent({

           docMetaRef: <DocMetaRef> {
               fingerprint: docInfoAdvertisement.docInfo.fingerprint,
               filename: docInfoAdvertisement.docInfo.filename,
               docInfo: docInfoAdvertisement.docInfo
           },
           docInfo: docInfoAdvertisement.docInfo,
           eventType: docInfoAdvertisement.advertisementType

       });

    }

}
