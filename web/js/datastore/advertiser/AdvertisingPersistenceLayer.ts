import {DocMetaRef} from '../DocMetaRef';
import {DocInfoAdvertisement} from './DocInfoAdvertisement';
import {DocInfoAdvertiser} from './DocInfoAdvertiser';
import {DocInfoAdvertisementListenerService} from './DocInfoAdvertisementListenerService';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {IPersistenceLayer} from '../IPersistenceLayer';
import {IListenablePersistenceLayer} from '../IListenablePersistenceLayer';
import {AbstractAdvertisingPersistenceLayer} from './AbstractAdvertisingPersistenceLayer';

/**
 * A PersistenceLayer that allows the user to receive advertisements regarding
 * updates to the PersistenceLayer from any window in the system.
 *
 * @ElectronRendererContext
 */
export class AdvertisingPersistenceLayer
    extends AbstractAdvertisingPersistenceLayer
    implements IListenablePersistenceLayer {

    private readonly docInfoAdvertisementListenerService = new DocInfoAdvertisementListenerService();

    constructor(persistenceLayer: IPersistenceLayer) {
        super(persistenceLayer);
    }

    public async init(): Promise<void> {

        this.docInfoAdvertisementListenerService
            .addEventListener((adv) => this.onDocInfoAdvertisement(adv));

        this.docInfoAdvertisementListenerService.start();

        return this.persistenceLayer.init();

    }

    public async stop(): Promise<void> {
        return this.persistenceLayer.stop();
    }

    protected broadcastEvent(event: PersistenceLayerEvent): void {

        DocInfoAdvertiser.send({
            docInfo: event.docInfo,
            advertisementType: event.eventType
        });

    }

    private onDocInfoAdvertisement(docInfoAdvertisement: DocInfoAdvertisement) {

        this.dispatchEvent({

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
