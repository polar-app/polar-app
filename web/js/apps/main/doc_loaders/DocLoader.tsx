import {LoadDocRequest} from './LoadDocRequest';
import {BrowserDocLoader} from './browser/BrowserDocLoader';
import {PersistenceLayerProvider} from '../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from './IDocLoader';

export class DocLoader implements IDocLoader {

    private readonly browserDocLoader: BrowserDocLoader;

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {
        return this.browserDocLoader.create(loadDocRequest);
    }

}
