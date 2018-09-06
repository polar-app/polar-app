import {ipcRenderer} from 'electron';
import {DocInfoAdvertisement, DocInfoAdvertisementListener} from './DocInfoAdvertisement';
import {Logger} from '../../logger/Logger';
import {SimpleReactor} from '../../reactor/SimpleReactor';

const log = Logger.create();

export class DocInfoAdvertisementListenerService {

    private readonly reactor: SimpleReactor<DocInfoAdvertisement> = new SimpleReactor();

    public start(): void {

        ipcRenderer.on('doc-info-advertisement', (event: any, docInfoAdvertisement: DocInfoAdvertisement) => {
            log.debug("Received new DocInfo advertisement: ", docInfoAdvertisement);
            this.reactor.dispatchEvent(docInfoAdvertisement);
        });

    }

    public addEventListener(docInfoAdvertisementListener: DocInfoAdvertisementListener): void {
        this.reactor.addEventListener(docInfoAdvertisementListener);
    }

}
