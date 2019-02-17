import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from '../../../../Preconditions';
import {IProvider} from '../../../../util/Providers';
import {PersistenceLayer} from '../../../../datastore/PersistenceLayer';
import {Backend} from '../../../../datastore/Backend';
import {Logger} from '../../../..//logger/Logger';
import {PDFLoader} from '../../file_loaders/PDFLoader';

const log = Logger.create();

export class BrowserDocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public async load(loadDocRequest: LoadDocRequest) {

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.fileRef, "fileRef");
        Preconditions.assertPresent(loadDocRequest.fileRef.name, "fileRef.name");

        const persistenceLayer = this.persistenceLayerProvider.get();

        // nwo resolve the URL for this doc.
        // TODO: this is slow and might be nice to have this computed async on
        // startup
        const optionalDatastoreFile
            = await persistenceLayer.getFile(Backend.STASH, loadDocRequest.fileRef);

        if (optionalDatastoreFile.isPresent()) {

            const datastoreFile = optionalDatastoreFile.get();

            const viewerURL = PDFLoader.createViewerURL(datastoreFile.url, loadDocRequest.fileRef.name);

            console.log("FIXME: viewing URL: " + viewerURL);

            const win = window.open(viewerURL, '_blank');
            if (win) {
                win.focus();
            }

        } else {
            log.warn("No datastore file for: ", loadDocRequest);
        }

    }

}
