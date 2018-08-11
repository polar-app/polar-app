import {Model} from '../Model';

const {DocFormats} = require("../docformat/DocFormats");
const {HTMLViewer} = require("./html/HTMLViewer");
const {PDFViewer} = require("./pdf/PDFViewer");

export class ViewerFactory {

    static create(model: Model) {

        switch(DocFormats.getFormat()) {
            case "html":
                return new HTMLViewer(model);

            case "pdf":
                return new PDFViewer();

            default:
                return null;
        }

    }

}
