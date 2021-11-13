import React from 'react';
import {LoadDocRequest} from "./doc_loaders/LoadDocRequest";
import {useBrowserDocLoader} from './doc_loaders/browser/BrowserDocLoader';
import {useSideNavDocLoader} from './doc_loaders/sidenav/SideNavDocLoaders';
import {SIDE_NAV_ENABLED} from "../../sidenav/SideNavStore";
import {BackendFileRefs} from "../../datastore/BackendFileRefs";
import {Either} from "polar-shared/src/util/Either";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

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

export function useDocLoaderForDocInfo() {

    const docLoader = useDocLoader();

    return React.useCallback((docInfo: IDocInfo) => {

        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo))!;

        const docLoadRequest: LoadDocRequest = {
            fingerprint: docInfo.fingerprint,
            title: docInfo.title || 'Untitled',
            backendFileRef,
            newWindow: true,
            url: docInfo.url
        }

        docLoader(docLoadRequest);

    }, [docLoader]);

}
