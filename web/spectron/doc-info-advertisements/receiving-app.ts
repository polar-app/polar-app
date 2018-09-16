import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {MemoryDatastore} from '../../js/datastore/MemoryDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../../js/datastore/advertiser/AdvertisingPersistenceLayer';
import {assertJSON} from '../../js/test/Assertions';
import {Dictionaries} from '../../js/util/Dictionaries';

const log = Logger.create();

SpectronRenderer.run(async (state) => {

    const memoryDatastore = new MemoryDatastore();

    const persistenceLayer = new DefaultPersistenceLayer(memoryDatastore);

    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(persistenceLayer);

    await advertisingPersistenceLayer.init();

    advertisingPersistenceLayer.addEventListener(adv => {

        console.log("Got the advertisement");

        const expected = {
            "progress": 100,
            "pagemarkType": "SINGLE_COLUMN",
            "properties": {},
            "archived": false,
            "flagged": false,
            "nrPages": 1,
            "fingerprint": "0x0001",
            "added": "2012-03-02T11:38:49.321Z"
        };

        assertJSON(Dictionaries.sorted(adv.docInfo), Dictionaries.sorted(expected));

        state.testResultWriter.write(true)
            .catch((err: Error) => {
                log.error("Could not receive event.", err);
            });

    });

});
