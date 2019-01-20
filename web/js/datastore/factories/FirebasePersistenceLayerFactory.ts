import {Logger} from '../../logger/Logger';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {AbstractAdvertisingPersistenceLayer} from '../advertiser/AbstractAdvertisingPersistenceLayer';
import {PersistenceLayer} from '../PersistenceLayer';
import {ErrorListener} from '../Datastore';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';

const log = Logger.create();

export class FirebasePersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        log.info("Using firebase persistence layer and disk store");

        const datastore = new FirebaseDatastore();

        return new NullListenablePersistenceLayer(new DefaultPersistenceLayer(datastore));

    }

}

export class NullListenablePersistenceLayer extends AbstractAdvertisingPersistenceLayer {

    constructor(delegate: PersistenceLayer) {
        super(delegate);
    }

    protected broadcastEvent(event: PersistenceLayerEvent): void {
    }

    public init(errorListener?: ErrorListener): Promise<void> {
        return super.delegate.init(errorListener);
    }

    public stop(): Promise<void> {
        return super.delegate.stop();
    }

}
