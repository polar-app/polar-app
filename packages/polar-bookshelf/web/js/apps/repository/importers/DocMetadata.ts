import {DocFormatName} from "../../../docformat/DocFormat";
import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {EPUBMetadata} from "polar-epub/src/EPUBMetadata";

export namespace DocMetadata {

    export async function getMetadata(docPath: string, type: DocFormatName) {

        if (type === 'pdf') {
            return await PDFMetadata.getMetadata(docPath);
        } else if (type === 'epub') {
            return await EPUBMetadata.getMetadata(docPath);
        }

        throw new Error("Invalid type: " + type);

    }

}
