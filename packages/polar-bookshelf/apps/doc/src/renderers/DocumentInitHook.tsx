import React from 'react';
import {
    useDocViewerJumpToPageLoader,
    useDocViewerPageJumpListener
} from "../DocViewerAnnotationHook";
import {ReadingProgressResume} from "../../../../web/js/view/ReadingProgressResume";
import {useDocViewerStore} from "../DocViewerStore";
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import useReadingProgressResume = ReadingProgressResume.useReadingProgressResume;

/**
 * Uses all the requirements we need including pagemark resume, jump via anchor
 * resume, etc.
 */
export function useDocumentInit() {

    const {pageNavigator, docMeta} = useDocViewerStore(['pageNavigator', 'docMeta']);
    const jumpToPageLoader = useDocViewerJumpToPageLoader();
    const [resumeProgressActive, resumeProgressHandler] = useReadingProgressResume();

    const doInit = React.useCallback(() => {
        if (document.location.hash.length !== 0) {
            return;
        }

        if (! pageNavigator) {
            throw new Error("No pageNavigator");
        }

        if (! docMeta) {
            throw new Error("No docMeta");
        }

        if (resumeProgressActive) {
            console.log("DocumentInit: Resuming reading progress via pagemarks");
            resumeProgressHandler();
        } else {

            // TODO: this is probably a bug and we shouldn't reference
            // document.location here I think.
            if (jumpToPageLoader(document.location, 'init')) {
                console.log("DocumentInit: Jumped to page via page param.")
            }

        }

        // TODO we aren't doing this right now because the EPUB viewer must
        // go to page 1 first... we can refactor this later once 2.0 is out.
        // pageNavigator.set(1);

        return undefined;

    }, [docMeta, jumpToPageLoader, pageNavigator, resumeProgressActive, resumeProgressHandler]);

    useComponentDidMount(() => {
        setTimeout(doInit, 1);
    })

}

export const DocumentInit = React.memo(function DocumentInit() {
    useDocViewerPageJumpListener();
    useDocumentInit();
    return null;
});
