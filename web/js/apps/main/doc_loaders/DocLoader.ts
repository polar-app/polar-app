import {LoadDocRequest} from './LoadDocRequest';
import {BrowserDocLoader} from './browser/BrowserDocLoader';
import {PersistenceLayerProvider} from '../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from './IDocLoader';
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";

export class DocLoader implements IDocLoader {

    private readonly browserDocLoader: BrowserDocLoader;

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {
        return this.browserDocLoader.create(loadDocRequest);
    }

}

export type DocLoaderCreator = (loadDocRequest: LoadDocRequest) => IDocLoadRequest;

export function useDocLoader(): DocLoaderCreator {

    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);

    return (loadDocRequest: LoadDocRequest) => {
        return browserDocLoader.create(loadDocRequest);
    }

}
