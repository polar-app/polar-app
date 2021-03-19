import {Broadcaster} from '../../ipc/Broadcaster';

/**
 * Sends {DocInfoAdvertisement}s out when we need to advertise a new one.
 */
export class DocInfoBroadcasterService {

    public async start() {
        // noinspection TsLint
        new Broadcaster('doc-info-advertisement:broadcast', 'doc-info-advertisement');
    }

}
