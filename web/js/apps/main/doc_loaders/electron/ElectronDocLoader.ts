import {LoadDocRequest} from '../LoadDocRequest';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {ipcRenderer} from 'electron';
import {ViewerURLs} from "../ViewerURLs";

export interface ILoadBrowserWindowRequest {
    readonly url: string;
    readonly newWindow: boolean;
}

export class ElectronDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const viewerURL = ViewerURLs.create(this.persistenceLayerProvider, loadDocRequest);

        return {

            async load(): Promise<void> {

                const loadBrowserWindowRequest: ILoadBrowserWindowRequest = {
                    url: viewerURL,
                    newWindow: loadDocRequest.newWindow
                };

                ipcRenderer.send('load-browser-window-request', loadBrowserWindowRequest);

            }

        };

    }

}

