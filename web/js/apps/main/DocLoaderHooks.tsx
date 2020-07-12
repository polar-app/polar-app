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
import { RepositoryDocViewerScreen } from '../repository/RepositoryApp';
import { BrowserDocLoader } from './doc_loaders/browser/BrowserDocLoader';
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export type DocLoaderCreator = (loadDocRequest: LoadDocRequest) => IDocLoadRequest;

function useDocLoaderElectron() {

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
                    component: (
                        <PersistentRoute exact path={path}>
                            <RepositoryDocViewerScreen persistenceLayerProvider={persistenceLayerProvider}/>
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

export function useDocLoader(): DocLoaderCreator {

    if (AppRuntime.isElectron()) {
        return useDocLoaderElectron();
    }

    return useDocLoaderDefault();

}
