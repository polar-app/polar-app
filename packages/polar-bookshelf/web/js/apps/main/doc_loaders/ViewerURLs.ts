import {LoadDocRequest} from "./LoadDocRequest";
import {PDFLoader} from "../file_loaders/PDFLoader";
import {EPUBLoader} from "../file_loaders/EPUBLoader";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {PersistenceLayerProvider} from "../../../datastore/PersistenceLayer";

export namespace ViewerURLs {

    export function create(persistenceLayerProvider: PersistenceLayerProvider,
                           loadDocRequest: LoadDocRequest) {

        const {backendFileRef, fingerprint} = loadDocRequest;

        const fileName = backendFileRef.name;

        const persistenceLayer = persistenceLayerProvider();

        // TODO: we don't actually have to call getFile to determine the type

        const datastoreFile = persistenceLayer.getFile(backendFileRef.backend, backendFileRef);

        if (FilePaths.hasExtension(fileName, "pdf")) {
            return PDFLoader.createViewerURL(fingerprint, datastoreFile.url, backendFileRef.name);
        } else if (FilePaths.hasExtension(fileName, "epub")) {
            return EPUBLoader.createViewerURL(fingerprint);
        } else {
            throw new Error("Unable to handle file: " + fileName);
        }
    }

}
