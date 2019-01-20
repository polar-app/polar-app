import {Logger} from '../../logger/Logger';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {AbstractAdvertisingPersistenceLayer} from '../advertiser/AbstractAdvertisingPersistenceLayer';
import {PersistenceLayer} from '../PersistenceLayer';
import {ErrorListener} from '../Datastore';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {Firebase} from '../../firebase/Firebase';

const log = Logger.create();

export class FirebasePersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        log.info("Using firebase persistence layer");

        Firebase.init();

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

}


