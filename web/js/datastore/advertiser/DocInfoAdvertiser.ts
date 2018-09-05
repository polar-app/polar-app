
import {ipcRenderer} from 'electron';
import {IDocInfoAdvertisement} from './DocInfoAdvertisement';

/**
 * Sends {DocInfoAdvertisement}s out when we need to advertise a new one.
 */
export class DocInfoAdvertiser {

    public static send(docInfoAdvertisement: IDocInfoAdvertisement) {
        // send this out to other renderers.
        ipcRenderer.send('doc-info-advertisement:broadcast', docInfoAdvertisement);
    }

}
