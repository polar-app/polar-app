import {ipcRenderer} from 'electron';
import {IDocInfoAdvertisement} from './DocInfoAdvertisement';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class DocInfoAdvertisementListenerService {

    public start(): void {

        ipcRenderer.on('doc-info-advertisement', (event: any, msg: IDocInfoAdvertisement) => {
            log.info("Received new DocInfo advertisement: ", msg);
        });

    }

}
