import {Model} from '../model/Model';
import {DocFormats} from '../docformat/DocFormats';
import {HTMLViewer} from './html/HTMLViewer';
import {PDFViewer} from './pdf/PDFViewer';

export class ViewerFactory {

    static create(model: Model) {

        let format = DocFormats.getFormat();
        switch(format) {
            case "html":
                return new HTMLViewer(model);

            case "pdf":
                return new PDFViewer();

            default:
                throw new Error("Unknown doc format: " + format);
        }

    }

}
