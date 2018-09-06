import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DocInfoAdvertisementListenerService} from '../../js/datastore/advertiser/DocInfoAdvertisementListenerService';
import {Logger} from '../../js/logger/Logger';

const log = Logger.create();

SpectronRenderer.run(async (state) => {

    const listenerService = new DocInfoAdvertisementListenerService();

    listenerService.addEventListener(event => {
        state.testResultWriter.write(true)
            .catch((err: Error) => {
                log.error("Could not receive event.", err);
            });
    });

    listenerService.start();

});
