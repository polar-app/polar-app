import React from 'react';
import {LoadDocRequest} from "./doc_loaders/LoadDocRequest";
import {useSideNavDocLoader} from './doc_loaders/sidenav/SideNavDocLoaders';
import {BackendFileRefs} from "../../datastore/BackendFileRefs";
import {Either} from "../../util/Either";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export type DocLoader = (loadDocRequest: LoadDocRequest) => void;

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

    return React.useCallback((loadDocRequest: LoadDocRequest) => {

        sideNavDocLoader(loadDocRequest);

    }, [sideNavDocLoader]);

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
