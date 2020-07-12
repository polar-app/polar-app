import React from 'react';
import {LoadDocRequest} from "./doc_loaders/LoadDocRequest";
import {IDocLoadRequest} from "./doc_loaders/IDocLoader";
import {usePersistenceLayerContext} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {
    TabDescriptor,
    useBrowserTabsCallbacks
} from "../../browser_tabs/BrowserTabsStore";
import {ViewerURLs} from "./doc_loaders/ViewerURLs";
import {PersistentRoute} from "../repository/PersistentRoute";
// import { RepositoryDocViewerScreen } from '../repository/RepositoryApp';
import {BrowserDocLoader} from './doc_loaders/browser/BrowserDocLoader';
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export type DocLoaderCreator = (loadDocRequest: LoadDocRequest) => IDocLoadRequest;

function useDocLoaderElectron() {

    // FIXME: this has SEVERE performance issues and causes the tabs to do a
    // full re-render...

    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const {addTab} = useBrowserTabsCallbacks();

    return (loadDocRequest: LoadDocRequest) => {

        const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
        const parsedURL = new URL(viewerURL);
        const path = parsedURL.pathname;

        return {

            async load(): Promise<void> {

                const tabDescriptor: TabDescriptor = {
                    url: path,
                    title: loadDocRequest.title,

                    // {/*<RepositoryDocViewerScreen persistenceLayerProvider={persistenceLayerProvider}/>*/}

                    component: (
                        <PersistentRoute exact path={path}>
                            <div>
                                Disabled for now.
                            </div>
                        </PersistentRoute>
                    )
                }

                addTab(tabDescriptor);

            }

        };

    }

}

function useDocLoaderDefault() {

    const {persistenceLayerProvider} = usePersistenceLayerContext();

    const browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);

    return (loadDocRequest: LoadDocRequest) => {
        return browserDocLoader.create(loadDocRequest);
    }

}

function useDocLoaderNull() {

    return (loadDocRequest: LoadDocRequest) => {

        return {

            async load(): Promise<void> {
                console.log("Used null DocLoader")
            }

        };

    }

}


export function useDocLoader(): DocLoaderCreator {

    // if (AppRuntime.isElectron()) {
    //     return useDocLoaderElectron();
    // }
    //
    return useDocLoaderDefault();
    //
    // return useDocLoaderNull();

}
