import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DocInfoAdvertisementListenerService} from '../../js/datastore/advertiser/DocInfoAdvertisementListenerService';
import {Logger} from '../../js/logger/Logger';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {PersistenceLayer} from '../../js/datastore/PersistenceLayer';
import {AdvertisingPersistenceLayer} from '../../js/datastore/advertiser/AdvertisingPersistenceLayer';

const log = Logger.create();

SpectronRenderer.run(async (state) => {


    const memoryDatastore = new MemoryDatastore();

    const persistenceLayer = new PersistenceLayer(memoryDatastore);

    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(persistenceLayer);

    await advertisingPersistenceLayer.init();

    advertisingPersistenceLayer.addEventListener(adv => {

        console.log("Got the advertisement");

        state.testResultWriter.write(true)
            .catch((err: Error) => {
                log.error("Could not receive event.", err);
            });

    });

});
