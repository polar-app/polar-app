import {Logger} from '../../logger/Logger';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {AbstractAdvertisingPersistenceLayer} from '../advertiser/AbstractAdvertisingPersistenceLayer';
import {PersistenceLayer, PersistenceLayerID} from '../PersistenceLayer';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';
import {Firebase} from '../../firebase/Firebase';
import {SharingDatastores} from '../SharingDatastores';

const log = Logger.create();

export class WebPersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        const toDatastore = () => {

            if (SharingDatastores.isSupported()) {
                return SharingDatastores.create();
            } else {
                Firebase.init();
                return new FirebaseDatastore();
            }

        };

        const datastore = toDatastore();

        log.info("Using datastore: " + datastore.id);

        return new NullListenablePersistenceLayer(new DefaultPersistenceLayer(datastore));

    }

}

export class NullListenablePersistenceLayer extends AbstractAdvertisingPersistenceLayer {

    public readonly id: PersistenceLayerID = 'null';

    constructor(delegate: PersistenceLayer) {
        super(delegate);
    }

    protected broadcastEvent(event: PersistenceLayerEvent): void {
    }

}


