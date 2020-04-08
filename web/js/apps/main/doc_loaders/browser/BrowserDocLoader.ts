import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PDFLoader} from '../../file_loaders/PDFLoader';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {Nav} from '../../../../ui/util/Nav';
import {PHZLoader} from '../../file_loaders/PHZLoader';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

const log = Logger.create();

export class BrowserDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const linkLoader = Nav.createLinkLoader({focus: true, newWindow: loadDocRequest.newWindow});

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
        Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

        const persistenceLayer = this.persistenceLayerProvider();

        return {

            async load(): Promise<void> {

                const {backendFileRef, fingerprint} = loadDocRequest;

                const datastoreFile = persistenceLayer.getFile(backendFileRef.backend, backendFileRef);

                const toViewerURL = () => {

                    const fileName = backendFileRef.name;

                    if (FilePaths.hasExtension(fileName, "pdf")) {
                        return PDFLoader.createViewerURL(fingerprint, datastoreFile.url, backendFileRef.name);
                    } else if (FilePaths.hasExtension(fileName, "phz")) {
                        return PHZLoader.createViewerURL(fingerprint, datastoreFile.url, backendFileRef.name);
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
