import {Logger} from '../../logger/Logger';
import {Viewer} from '../Viewer';

const log = Logger.create();

export class PDFViewer extends Viewer {

    start() {

        super.start();

        log.info("Starting PDFViewer");

    }

}
