import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {ViewerURLs} from "../ViewerURLs";
import {DocURLLoader} from './DocURLLoader';

export class BrowserDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const viewerURL = ViewerURLs.create(this.persistenceLayerProvider, loadDocRequest);

        const linkLoader = DocURLLoader.create();

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
        Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

        return {

            async load(): Promise<void> {
                console.log("Loading URL: ", viewerURL);
                linkLoader(viewerURL);
            }

        };

    }

}
