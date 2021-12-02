import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {EPUBMetadataUsingBrowser} from "polar-epub/src/EPUBMetadataUsingBrowser";
import {FileType} from "../../main/file_loaders/FileType";

export namespace DocMetadata {

    export async function getMetadata(docPath: string, fileType: FileType) {

        if (fileType === 'pdf') {
            return await PDFMetadata.getMetadata(docPath);
        } else if (fileType === 'epub') {
            return await EPUBMetadataUsingBrowser.getMetadata(docPath);
        }

        throw new Error("Invalid type: " + fileType);

    }

}
