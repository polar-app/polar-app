import {Logger} from '../../logger/Logger';
import {Viewer} from '../Viewer';
import {DocDetail} from '../../metadata/DocDetail';
import undefinedError = Mocha.utils.undefinedError;

const log = Logger.create();

export class PDFViewer extends Viewer {

    start() {

        super.start();

        log.info("Starting PDFViewer");

    }

    docDetail(): DocDetail | undefined{
        return undefined;
    }

}
