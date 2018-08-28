import {Logger} from '../../logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';

const log = Logger.create();

export class PDFViewer extends Viewer {

    start() {

        super.start();

        log.info("Starting PDFViewer");

    }

    docDetail(): DocDetail {
        // TODO: this should go into DocFormat
        throw new Error("Not implemented");
    }

}
