import {isLoadDocRequestForPDF, LoadDocRequest} from "./LoadDocRequest";
import {PDFLoader} from "../file_loaders/PDFLoader";
import {EPUBLoader} from "../file_loaders/EPUBLoader";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {PersistenceLayerProvider} from "../../../datastore/PersistenceLayer";

export namespace ViewerURLs {

    export interface IViewerURL {
        readonly url: string;
        readonly initialUrl?: string;
    }

    export function create(persistenceLayerProvider: PersistenceLayerProvider,
                           loadDocRequest: LoadDocRequest): IViewerURL {

        const {backendFileRef, fingerprint} = loadDocRequest;

        const fileName = backendFileRef.name;

        if (isLoadDocRequestForPDF(loadDocRequest)) {

            return PDFLoader.createViewerURL({
                fingerprint,
                page: loadDocRequest.page
            });

        } else if (FilePaths.hasExtension(fileName, "epub")) {
            return EPUBLoader.createViewerURL(fingerprint);
        } else {
            throw new Error("Unable to handle file: " + fileName);
        }
    }

}
