import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {AdvertisingPersistenceLayer} from '../../js/datastore/advertiser/AdvertisingPersistenceLayer';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';

const log = Logger.create();

SpectronRenderer.run(async () => {

    log.info("Sending advertisement now.");

    const docMeta = MockDocMetas.createWithinInitialPagemarks('0x0001', 1);

    const memoryDatastore = new MemoryDatastore();

    const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(persistenceLayer);

    await advertisingPersistenceLayer.init();
    await advertisingPersistenceLayer.syncDocMeta(docMeta);

});
