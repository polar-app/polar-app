import {useLocation} from "react-router-dom";
import React from "react";
import {DocViewerAppURLs} from "../DocViewerAppURLs";

/**
 * Listen to route changes so that if the document changes we can resize.  This
 * is a super efficient function so if we call it too many times it doesn't
 * really matter.
 */
export function useSidenavDocumentChangeCallback(callback: () => void) {

    const location = useLocation();

    const currentDocID = React.useRef(DocViewerAppURLs.parse(document.location.href)?.id);

    React.useEffect(() => {

        const newDocViewerURL = DocViewerAppURLs.parse(document.location.href);

        if (newDocViewerURL?.id && newDocViewerURL?.id !== currentDocID.current) {
            callback();
        }

        currentDocID.current = newDocViewerURL?.id;

    }, [callback, location]);

}
