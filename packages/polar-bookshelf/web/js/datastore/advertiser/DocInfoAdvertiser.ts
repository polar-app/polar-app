
import {ipcRenderer} from 'electron';
import {DocInfoAdvertisement} from './DocInfoAdvertisement';

/**
 * Sends {DocInfoAdvertisement}s out when we need to advertise a new one.
 */
export class DocInfoAdvertiser {

    public static send(docInfoAdvertisement: DocInfoAdvertisement) {
        // send this out to other renderers.
        ipcRenderer.send('doc-info-advertisement:broadcast', docInfoAdvertisement);
    }

}
