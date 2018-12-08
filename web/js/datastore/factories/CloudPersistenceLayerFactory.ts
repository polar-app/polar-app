import {Logger} from '../../logger/Logger';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {RemoteDatastores} from '../RemoteDatastores';
import {CloudAwareDatastore} from '../CloudAwareDatastore';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {LazyWriteListenablePersistenceLayer} from '../LazyWriteListenablePersistenceLayer';

const log = Logger.create();

export class CloudPersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        log.info("Using remote persistence layer and disk store");

        const local = RemoteDatastores.create();
        const cloud = new FirebaseDatastore();

        const datastore = new CloudAwareDatastore(local, cloud);

        const defaultPersistenceLayer = new DefaultPersistenceLayer(datastore);

        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(defaultPersistenceLayer);

        return advertisingPersistenceLayer;

    }

}
