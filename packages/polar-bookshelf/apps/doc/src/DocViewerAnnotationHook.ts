import {useLocation} from "react-router-dom";
import {useDocViewerCallbacks} from "./DocViewerStore";
import {AnnotationLinks} from "../../../web/js/annotation_sidebar/AnnotationLinks";
import {ILocation} from "../../../web/js/react/router/ReactRouters";
import React from 'react';
import {useDocViewerContext} from "./renderers/DocRenderer";
import {DocViewerAppURLs} from "./DocViewerAppURLs";

export type DocViewerJumpCause = 'init' | 'history';

export function useDocViewerJumpToPageLoader(): (location: ILocation, cause: DocViewerJumpCause) => boolean {

    const {onPageJump} = useDocViewerCallbacks();
    const prevLocationRef = React.useRef<ILocation | undefined>();
    const currentDocumentLocationPredicate = useCurrentDocumentLocationPredicate();

    return (location, cause) => {

        try {

            if (currentDocumentLocationPredicate(location)) {

                if (prevLocationRef.current?.hash === location.hash) {
                    return false;
                }

                const annotationLink = AnnotationLinks.parse(location.hash);

                if (annotationLink?.page) {
                    console.log(`Jumping to page ${annotationLink.page} due to '${cause}'`);
                    onPageJump(annotationLink.page);
                    return true;
                }


            }

            return false;

        } finally {
            prevLocationRef.current = location;
        }

    }

}


/**
 * Only return true if the URL we're on is for the current doc.  For anything without sidenav
 * this will just return true.
 */
function useCurrentDocumentLocationPredicate() {

    const {docID} = useDocViewerContext();

    return React.useCallback((location: ILocation): boolean => {

        const parsedURL = DocViewerAppURLs.parse(`${location.pathname}${location.search}${location.hash}`);

        return docID === parsedURL?.id;

    }, [docID]);

}

export function useDocViewerPageJumpListener() {
    const location = useLocation();
    const docViewerJumpToPageLoader = useDocViewerJumpToPageLoader();
    docViewerJumpToPageLoader(location, 'history');
}
