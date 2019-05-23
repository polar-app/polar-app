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
import {FilePaths} from '../../../../util/FilePaths';

const log = Logger.create();

export class BrowserDocLoader implements IDocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const linkLoader = Nav.createLinkLoader();

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
        Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

        const persistenceLayer = this.persistenceLayerProvider.get();

        return {

            async load(): Promise<void> {

                const {backendFileRef} = loadDocRequest;

                const datastoreFile = persistenceLayer.getFile(backendFileRef.backend, backendFileRef);

                const toViewerURL = () => {

                    const fileName = backendFileRef.name;

                    if (FilePaths.hasExtension(fileName, "pdf")) {
                        return PDFLoader.createViewerURL(datastoreFile.url, backendFileRef.name);
                    } else if (FilePaths.hasExtension(fileName, "phz")) {
                        return PHZLoader.createViewerURL(datastoreFile.url, backendFileRef.name);
                    } else {
                        throw new Error("Unable to handle file: " + fileName);
                    }

                };

                const viewerURL = toViewerURL();

                linkLoader.load(viewerURL);

            }

        };

    }

}
