import React from 'react';
import {useDocViewerPageJumpListener} from "../DocViewerAnnotationHook";
import {useDocViewerStore} from "../DocViewerStore";
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";

/**
 * Uses all the requirements we need including pagemark resume, jump via anchor
 * resume, etc.
 */
export function useDocumentInit() {

    const {pageNavigator, docMeta} = useDocViewerStore(['pageNavigator', 'docMeta']);

    const doInit = React.useCallback(() => {
        if (document.location.hash.length !== 0) {
            return;
        }

        if (!pageNavigator) {
            throw new Error("No pageNavigator");
        }

        if (!docMeta) {
            throw new Error("No docMeta");
        }

        // TODO we aren't doing this right now because the EPUB viewer must
        // go to page 1 first... we can refactor this later once 2.0 is out.
        // pageNavigator.set(1);

        return undefined;

    }, [docMeta, pageNavigator]);

    useComponentDidMount(() => {
        setTimeout(doInit, 1);
    })

}

export const DocumentInit = React.memo(function DocumentInit() {
    useDocViewerPageJumpListener();
    useDocumentInit();
    return null;
});
