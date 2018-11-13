import {Logger} from '../../logger/Logger';
import {IListenablePersistenceLayer} from '../IListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {RemoteDatastores} from '../RemoteDatastores';

const log = Logger.create();

export class RemotePersistenceLayerFactory {

    public static async create(): Promise<IListenablePersistenceLayer> {

        log.info("Using remote persistence layer and disk store");

        const datastore = RemoteDatastores.create();

        const defaultPersistenceLayer = new DefaultPersistenceLayer(datastore);
        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(defaultPersistenceLayer);

        // note that we need to always pre-init before we return.
        await advertisingPersistenceLayer.init();

        return advertisingPersistenceLayer;

    }

}
