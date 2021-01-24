import * as React from 'react';
import {useHistory} from "react-router-dom";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";
import {useDocURLLoader} from "../apps/main/doc_loaders/browser/DocURLLoader";
import {AnnotationLinks, IAnnotationPtr} from "./AnnotationLinks";

/**
 * This is the default jump to annotation button that's used in the document
 * repository
 */
export function useJumpToAnnotationHandler() {

    const history = useHistory();
    const docURLLoader = useDocURLLoader();

    function isDocViewer() {
        return DocViewerAppURLs.parse(document.location.href) !== undefined;
    }

    return React.useCallback((ptr: IAnnotationPtr) => {

        if (isDocViewer()) {
            const hash = AnnotationLinks.createHash(ptr);
            history.push({hash});
        } else {
            const url = AnnotationLinks.createURL(ptr);
            docURLLoader(url);
        }

    }, [docURLLoader, history]);

}
