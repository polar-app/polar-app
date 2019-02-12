import {LoadDocRequest} from './LoadDocRequest';
import {Preconditions} from '../../../Preconditions';
import {DistRuntime} from '../../../dist_runtime/DistRuntime';
import {ElectronDocLoader} from './electron/ElectronDocLoader';
import {BrowserDocLoader} from './browser/BrowserDocLoader';
import {IProvider} from '../../../util/Providers';
import {PersistenceLayer} from '../../../datastore/PersistenceLayer';

export class DocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    private readonly electronDocLoader: ElectronDocLoader;
    private readonly browserDocLoader: BrowserDocLoader;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.electronDocLoader = new ElectronDocLoader(persistenceLayerProvider);
        this.browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);
    }

    public async load(loadDocRequest: LoadDocRequest) {

        if (DistRuntime.get() === 'electron') {
            await this.electronDocLoader.load(loadDocRequest);
        } else {
            await this.browserDocLoader.load(loadDocRequest);
        }

    }


}
