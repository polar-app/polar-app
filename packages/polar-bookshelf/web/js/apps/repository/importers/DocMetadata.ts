import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {EPUBMetadata} from "polar-epub/src/EPUBMetadata";
import {FileType} from "../../main/file_loaders/FileType";

export namespace DocMetadata {

    export async function getMetadata(docPath: string, fileType: FileType) {

        if (fileType === 'pdf') {
            return await PDFMetadata.getMetadata(docPath);
        } else if (fileType === 'epub') {
            return await EPUBMetadata.getMetadata(docPath);
        }

        throw new Error("Invalid type: " + fileType);

    }

}
