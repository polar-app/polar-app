import React from 'react';
import {LoadDocRequest} from "./doc_loaders/LoadDocRequest";
import {useBrowserDocLoader} from './doc_loaders/browser/BrowserDocLoader';
import { useSideNavDocLoader } from './doc_loaders/sidenav/SideNavDocLoaders';
import {SIDE_NAV_ENABLED} from "../../sidenav/SideNavStore";

export type DocLoader = (loadDocRequest: LoadDocRequest) => void;


function useDocLoaderDefault() {
    return useBrowserDocLoader();
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

export function useDocLoader(): DocLoader {

    const sideNavDocLoader = useSideNavDocLoader();
    const defaultDocLoader = useDocLoaderDefault();

    return React.useCallback((loadDocRequest: LoadDocRequest) => {

        if (SIDE_NAV_ENABLED) {
            sideNavDocLoader(loadDocRequest);
        } else {
            defaultDocLoader(loadDocRequest);
        }

    }, [defaultDocLoader, sideNavDocLoader]);

}