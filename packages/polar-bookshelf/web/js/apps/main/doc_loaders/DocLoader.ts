import {LoadDocRequest} from './LoadDocRequest';
import {ElectronDocLoader} from './electron/ElectronDocLoader';
import {BrowserDocLoader} from './browser/BrowserDocLoader';
import {PersistenceLayerProvider} from '../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from './IDocLoader';
import {AppRuntime} from 'polar-shared/src/util/AppRuntime';

export class DocLoader implements IDocLoader {

    private readonly electronDocLoader: ElectronDocLoader;
    private readonly browserDocLoader: BrowserDocLoader;

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.electronDocLoader = new ElectronDocLoader(persistenceLayerProvider);
        this.browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        if (AppRuntime.get() === 'electron') {
            return this.electronDocLoader.create(loadDocRequest);
        } else {
            return this.browserDocLoader.create(loadDocRequest);
        }

    }

}
