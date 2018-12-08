import {Logger} from '../../logger/Logger';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {RemoteDatastores} from '../RemoteDatastores';

const log = Logger.create();

export class RemotePersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        log.info("Using remote persistence layer and disk store");

        const datastore = RemoteDatastores.create();

        const defaultPersistenceLayer = new DefaultPersistenceLayer(datastore);
        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(defaultPersistenceLayer);

        return advertisingPersistenceLayer;

    }

}
