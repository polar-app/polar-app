import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DocInfoAdvertiser} from '../../js/datastore/advertiser/DocInfoAdvertiser';
import {DocInfoAdvertisement} from '../../js/datastore/advertiser/DocInfoAdvertisement';
import {PagemarkType} from '../../js/metadata/PagemarkType';
import {Logger} from '../../js/logger/Logger';

const log = Logger.create();

SpectronRenderer.run(async () => {

    log.info("Sending advertisement now.");

    const docInfoAdvertisement: DocInfoAdvertisement = {

        docInfo: {
            fingerprint: '0x001',
            nrPages: 1,
            filename: '0x0001.pdf',
            progress: 10,
            pagemarkType: PagemarkType.SINGLE_COLUMN,
            properties: {},
            archived: false,
            flagged: false
        },

        advertisementType: 'created'

    };

    DocInfoAdvertiser.send(docInfoAdvertisement);

});
