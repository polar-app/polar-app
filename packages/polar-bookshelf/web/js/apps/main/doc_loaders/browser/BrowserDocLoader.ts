import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {Nav} from '../../../../ui/util/Nav';
import {ViewerURLs} from "../ViewerURLs";

export class BrowserDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const linkLoader = Nav.createLinkLoader({focus: true, newWindow: loadDocRequest.newWindow});

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
        Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

        const viewerURL = ViewerURLs.create(this.persistenceLayerProvider, loadDocRequest);

        return {

            async load(): Promise<void> {
                linkLoader.load(viewerURL);
            }

        };

    }

}
