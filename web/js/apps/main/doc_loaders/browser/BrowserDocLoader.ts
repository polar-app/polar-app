import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from '../../../../Preconditions';
import {IProvider} from '../../../../util/Providers';
import {PersistenceLayer} from '../../../../datastore/PersistenceLayer';
import {Backend} from '../../../../datastore/Backend';
import {Logger} from '../../../../logger/Logger';
import {PDFLoader} from '../../file_loaders/PDFLoader';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {Nav} from '../../../../ui/util/Nav';
import {PHZLoader} from '../../file_loaders/PHZLoader';

const log = Logger.create();

export class BrowserDocLoader implements IDocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const linkLoader = Nav.createLinkLoader();

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.fileRef, "fileRef");
        Preconditions.assertPresent(loadDocRequest.fileRef.name, "fileRef.name");

        const persistenceLayer = this.persistenceLayerProvider.get();

        return {

            async load(): Promise<void> {

                const optionalDatastoreFile
                    = await persistenceLayer.getFile(Backend.STASH, loadDocRequest.fileRef);

                if (optionalDatastoreFile.isPresent()) {

                    const datastoreFile = optionalDatastoreFile.get();

                    const toViewerURL = () => {

                        const fileName = loadDocRequest.fileRef.name;

                        if (fileName.endsWith(".pdf")) {
                            return PDFLoader.createViewerURL(datastoreFile.url, loadDocRequest.fileRef.name);
                        } else if (fileName.endsWith(".phz")) {
                            return PHZLoader.createViewerURL(datastoreFile.url, loadDocRequest.fileRef.name);
                        } else {
                            throw new Error("Unable to handle file: " + fileName);
                        }

                    };

                    const viewerURL = toViewerURL();

                    linkLoader.load(viewerURL);

                } else {
                    log.warn("No datastore file for: ", loadDocRequest);
                }

            }

        };

    }

}
