import {LoadDocRequest} from '../LoadDocRequest';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {ipcRenderer} from 'electron';
import {ViewerURLs} from "../ViewerURLs";

export interface ILoadBrowserWindowRequest {
    readonly url: string;
    readonly newWindow: boolean;
}

/**
 * @Deprecated now using this code in polar-desktop-app
 */
export class ElectronDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        // TODO: this won't be need in the future as window.open now works on
        // Electron - in 9.x I think.

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

