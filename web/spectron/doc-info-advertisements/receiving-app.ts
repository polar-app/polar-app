import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../../js/datastore/advertiser/AdvertisingPersistenceLayer';

const log = Logger.create();

SpectronRenderer.run(async (state) => {


    const memoryDatastore = new MemoryDatastore();

    const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

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
